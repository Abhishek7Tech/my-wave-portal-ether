const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.parseEther("0.1"),
    });
    await waveContract.waitForDeployment();
    
    console.log("Contract deployed to:", waveContract.target);
    console.log("Contract deployed by:", owner.address);


    // let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.target);

    console.log("Contract balance Before:", hre.ethers.formatEther(contractBalance));

    await waveContract.getTotalWaves();

    const waveTxn = await waveContract.wave("Holy Moly!");
    await waveTxn.wait();

    await waveContract.getTotalWaves();

    const waveTxn2 = await waveContract.connect(randomPerson).wave("BOLY MOLY!");
    await waveTxn2.wait();

    await waveContract.getTotalWaves();


    contractBalance = await hre.ethers.provider.getBalance(waveContract.target);

    console.log("Contract Balance Later:", hre.ethers.formatEther(contractBalance));

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