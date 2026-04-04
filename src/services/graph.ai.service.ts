import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { mistralModel, cohereModel, geminiModel } from "./model.service.js";
import { createAgent, providerStrategy } from "langchain";
import { z } from "zod";

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    judge_recommendation: new ReducedValue(
        z.object({
            solution_1_score: z.number(),
            solution_2_score: z.number(),
        }).default({
            solution_1_score: 0,
            solution_2_score: 0,
        }),
        {
            reducer: (current, next) => {
                return next;
            }
        }
    ),
});

const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {
    console.log(state)
    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])
    return {
        solution_1: mistral_solution.text,
        solution_2: cohere_solution.text
    }
}

const judgeNode: GraphNode<typeof State> = async (state: typeof State) => {
    const judgeAgent = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
        }))
    })

    const judgeResponse = await judgeAgent.invoke({

        messages: [
            new HumanMessage(
                `You are a judge tasked with evaluating two solutions to a problem.
                
                The Problem is : ${state.messages[0].text}.
                The fist Solution is: ${state.solution_1}.
                The second Solution is: ${state.solution_2}.

                Please provide a score between 0 and 10 for each solution, where 0 means the solution is completly incorrect or irrelevant and 10 means the solution is perfect and fully addresses the problem.
                `
            )
        ]
    })
    const result = judgeResponse.structuredResponse

    return {
        judge_recommendation: result
    }
}

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();

export default async function (userMessage: string) {
    const result = await graph.invoke({
        messages: [
            new HumanMessage(userMessage)
        ]
    })
    console.log(result)
    return result.messages
}