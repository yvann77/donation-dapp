const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "donateur",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "montant",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "DonationReceived",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "donations",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "donateur",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "montant",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "donationsByDonator",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "nextId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "createDonation",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_donator",
          "type": "address"
        }
      ],
      "name": "getDonationsByDonator",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getDonation",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "donateur",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "montant",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct Donation.DonationInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
  const contractAddress = '0xB728620bc1b2C5870730AA3EAbeDfADf912D377e';
  let web3;
  let donationContract;
  let accounts;
  
  window.addEventListener('load', async () => {
      if (window.ethereum) {
          web3 = new Web3(window.ethereum);
          try {
              await window.ethereum.enable();
              accounts = await web3.eth.getAccounts();
              donationContract = new web3.eth.Contract(contractABI, contractAddress);
              updateTotalDonations();
              listDonations();
          } catch (error) {
              showError("L'utilisateur a refusé l'accès au compte.");
          }
      } else {
          showError('Navigateur non-Ethereum détecté. Essayez d\'installer MetaMask!');
      }
  });
  
  async function createDonation() {
      const amountInput = document.getElementById('donationAmount');
      const amount = web3.utils.toWei(amountInput.value, 'ether');
      try {
          await donationContract.methods.createDonation().send({ from: accounts[0], value: amount });
          showSuccess("Don effectué avec succès!");
          updateTotalDonations();
          listDonations();
      } catch (error) {
          showError("Erreur lors du don: " + error.message);
      }
  }
  
  async function updateTotalDonations() {
      const balance = await web3.eth.getBalance(contractAddress);
      document.getElementById('totalDonations').innerText = web3.utils.fromWei(balance, 'ether') + " ETH";
  }
  
  async function listDonations() {
      const donationCount = await donationContract.methods.nextId().call();
      const donationDiv = document.getElementById('donations');
      donationDiv.innerHTML = '';
      for (let i = 0; i < donationCount; i++) {
          try {
              const donation = await donationContract.methods.getDonation(i).call();
              donationDiv.innerHTML += `
                  <p>
                      ID: ${donation.id}<br>
                      Donateur: ${donation.donateur}<br>
                      Montant: ${web3.utils.fromWei(donation.montant, 'ether')} ETH<br>
                      Date: ${new Date(donation.timestamp * 1000).toLocaleString()}
                  </p>
              `;
          } catch (error) {
              console.error("Erreur lors de la récupération de la donation:", error);
          }
      }
  }
  
  function showError(message) {
      const errorDiv = document.getElementById('error');
      errorDiv.style.display = 'block';
      errorDiv.innerText = message;
  }
  
  function showSuccess(message) {
      const successDiv = document.getElementById('success');
      successDiv.style.display = 'block';
      successDiv.innerText = message;
      setTimeout(() => { successDiv.style.display = 'none'; }, 3000);
  }