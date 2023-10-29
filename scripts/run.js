const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.waitForDeployment();
    
    console.log("Contract deployed to:", waveContract.target);
    console.log("Contract deployed by:", owner.address);

    await waveContract.getTotalWaves();

    const waveTxn = await waveContract.wave("Holy Moly!");
    await waveTxn.wait();

    await waveContract.getTotalWaves();

    const waveTxn2 = await waveContract.connect(randomPerson).wave("BOLY MOLY!");
    await waveTxn2.wait();

    await waveContract.getTotalWaves();

    const allWaves = await waveContract.getAllWaves();
    console.log("ALL", allWaves);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }catch(error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();