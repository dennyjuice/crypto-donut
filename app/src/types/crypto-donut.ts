export type CryptoDonut = {
  version: "0.1.0";
  name: "crypto_donut";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "baseAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "sendDonation";
      accounts: [
        {
          name: "baseAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdraw";
      accounts: [
        {
          name: "baseAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "baseAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "donators";
            type: {
              vec: {
                defined: "Donators";
              };
            };
          },
          {
            name: "owner";
            type: "publicKey";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "Donators";
      type: {
        kind: "struct";
        fields: [
          {
            name: "user";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          }
        ];
      };
    }
  ];
  metadata: {
    address: "3WLaHbMg2syxjgKcv5UPT5Gtnig4mg1KzAYinSP6tzxN";
  };
};
