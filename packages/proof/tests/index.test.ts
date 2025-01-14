import { formatBytes32String } from "@ethersproject/strings"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { genKeypair } from "ec-elgamal-circom/src";
import { getCurveFromName } from "ffjavascript"
import { SemaphoreProof, generateProof, packProof, unpackProof, verifyProof } from "../src"

describe("Proof", () => {
    const treeDepth = 20

    const message = formatBytes32String("Hello world")
    const scope = formatBytes32String("Scope")

    const identity = new Identity(42)
    const ecKeypair = genKeypair();

    let fullProof: SemaphoreProof
    let curve: any

    beforeAll(async () => {
        curve = await getCurveFromName("bn128")
    })

    afterAll(async () => {
        await curve.terminate()
    })

    describe("# generateProof", () => {
        it("Should not generate Semaphore proofs if the identity is not part of the group", async () => {
            const group = new Group([BigInt(1), BigInt(2)])

            const fun = () => generateProof(identity, group, message, scope, ecKeypair.pubKey, treeDepth)

            await expect(fun).rejects.toThrow("does not exist")
        })

        it("Should generate a Semaphore proof", async () => {
            const group = new Group([BigInt(1), BigInt(2), identity.commitment])

            fullProof = await generateProof(identity, group, message, scope, ecKeypair.pubKey, treeDepth)

            expect(typeof fullProof).toBe("object")
            expect(fullProof.treeRoot).toBe(group.root)
        })
    })

    describe("# verifyProof", () => {
        it("Should verify a Semaphore proof", async () => {
            const response = await verifyProof(fullProof)

            expect(response).toBe(true)
        })
    })

    describe("# packProof/unpackProof", () => {
        it("Should return a packed proof", async () => {
            const originalProof = unpackProof(fullProof.proof)
            const proof = packProof(originalProof)

            expect(proof).toStrictEqual(fullProof.proof)
        })
    })
})
