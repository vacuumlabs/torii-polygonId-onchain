// Imports
// ========================================================
import { ethers } from "hardhat";

// torii generated proof
const proof = {
  id: 1,
  circuitId: "credentialAtomicQuerySigV2",
  proof: {
    pi_a: [
      "5095845430838949457139720916522180254192659840822041460217188485746148648011",
      "1044290150956355104214532658117004437014594301562825107512822239890931266322",
      "1",
    ],
    pi_b: [
      [
        "11725180645226715663157713558665824291315524113034010024765814868927463644161",
        "13436807361043396719007439168756363274971497545284083826639504074257169805291",
      ],
      [
        "17618699418959771726136054872539780543799923604428460731663703881024595575683",
        "9041295501446032349491152527539236201619557321759003379773914611967114723978",
      ],
      ["1", "0"],
    ],
    pi_c: [
      "20319230921565313898589640177186403946386437717035819569127671031961249330266",
      "15688933529346643761161803414872051925209655649329174369465384076095602061511",
      "1",
    ],
    protocol: "groth16",
    curve: "bn128",
  },
  pub_signals: [
    "1",
    "18082901570879204220316112049683805236270469742458505158230799909110550785",
    "6624349039228295194714637061287869474347588845056309775042783848620933560383",
    "1",
    "19753192886485944962349824531789188393684210997933647071761050713926275329",
    "1",
    "6624349039228295194714637061287869474347588845056309775042783848620933560383",
    "1690534972",
    "74977327600848231385663280181476307657",
    "0",
    "17040667407194471738958340146498954457187839778402591036538781364266841966",
    "2",
    "1",
    "99",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ],
};

const main = async () => {
  const verifierContract = "ERC20Verifier";
  // Deployed contract address
  const ERC20VerifierAddress = "0x1245cbDc39cb33a76D84aA62AAcEFe54ffE260f8";
  // Retrieve contract to interact with it
  const erc20Verifier = await ethers.getContractAt(
    verifierContract,
    ERC20VerifierAddress
  );

  try {
    const { inputs, pi_a, pi_b, pi_c } = prepareInputs(proof);
    // const { inputs, pi_a, pi_b, pi_c } = toBigNumber(prepareInputs(proof))
    const requestId = Number(await erc20Verifier.TRANSFER_REQUEST_ID());
    // construction of the params is inspired by
    // https://github.com/0xPolygonID/contracts/blob/main/test/validators/sig/index.ts
    // see utils below this function
    const tx = await erc20Verifier.submitZKPResponse(
      requestId,
      inputs,
      pi_a,
      pi_b,
      pi_c
    );

    tx.wait();
    console.log(
      `Request set at:\nNOTE: May take a little bit to show up\nhttps://mumbai.polygonscan.com/tx/${tx.hash}`
    );
  } catch (e) {
    console.error("Error: ", e);
  }
};

// Init
// ========================================================
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// UTILS copied from:
// https://github.com/0xPolygonID/contracts/blob/main/test/utils/deploy-utils.ts
// when looking on how to construct params from submitZKPResponse
export function prepareInputs(json: any): VerificationInfo {
  const { proof, pub_signals } = json;
  const { pi_a, pi_b, pi_c } = proof;
  const [[p1, p2], [p3, p4]] = pi_b as string[][];
  const preparedProof = {
    pi_a: pi_a.slice(0, 2),
    pi_b: [
      [p2, p1],
      [p4, p3],
    ] as [[string, string], [string, string]],
    pi_c: pi_c.slice(0, 2),
  };

  return { inputs: pub_signals, ...preparedProof };
}

export interface VerificationInfo {
  inputs: Array<string>;
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
}

export function toBigNumber({
  inputs,
  pi_a,
  pi_b,
  pi_c,
}: VerificationInfo): VerificationInfo {
  return {
    inputs: inputs.map((input) => ethers.BigNumber.from(input)),
    pi_a: pi_a.map((input) => ethers.BigNumber.from(input)),
    pi_b: pi_b.map((arr) => arr.map((input) => ethers.BigNumber.from(input))),
    pi_c: pi_c.map((input) => ethers.BigNumber.from(input)),
  } as unknown as VerificationInfo;
}
