const Donation = artifacts.require("Donation");

contract("Donation", (accounts) => {
    let donationInstance;

    before(async () => {
        donationInstance = await Donation.deployed();
    });

    it("should create a donation", async () => {
        const donationAmount = web3.utils.toWei("0.1", "ether");
        await donationInstance.createDonation({ from: accounts[0], value: donationAmount });

        const donation = await donationInstance.getDonation(0);
        assert.equal(donation.donateur, accounts[0], "Le donateur n'est pas correct");
        assert.equal(donation.montant, donationAmount, "Le montant n'est pas correct");
    });

    it("should get donations by donator", async () => {
        const donationAmount = web3.utils.toWei("0.2", "ether");
        await donationInstance.createDonation({ from: accounts[1], value: donationAmount });

        const donations = await donationInstance.getDonationsByDonator(accounts[1]);
        assert.equal(donations.length, 1, "Le nombre de donations n'est pas correct");
    });

    it("should fail when creating a donation with 0 value", async () => {
        try {
            await donationInstance.createDonation({ from: accounts[0], value: 0 });
            assert.fail("La transaction aurait dû échouer");
        } catch (error) {
            assert(error.message.includes("Le montant du don doit etre superieur a 0"), "Message d'erreur incorrect");
        }
    });
});