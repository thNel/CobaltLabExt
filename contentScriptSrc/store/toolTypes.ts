export const toolTypes = [
  {
    src: 'https://static.cobaltlab.tech/images/6a42b357c3d1ea9d253b9939ca6953a7d60a4d827567944fac3c953de5173c28.png',
    name: 'axe1',
  },
  {
    src: 'https://static.cobaltlab.tech/images/0fc8cbc453c83292a5d269395e73babc8b960303925aa13eed952185c2236048.png',
    name: 'axe2',
  },
  {
    src: 'https://static.cobaltlab.tech/images/bb9fad17b727ad7d6a9c2b719794a540414f0ff0f8eb93b4f1969663334562d5.png',
    name: 'axe3',
  },
  {
    src: 'https://static.cobaltlab.tech/images/2c54b84c1606aaba3e6bb2f5ec2ffec82d52224ed62fa26d6cdd1f5c36949569.png',
    name: 'axe4',
  },
  {
    src: 'https://static.cobaltlab.tech/images/06f51840a178396e960aebe069eb298067c8d6f776e292e424f0b39b8659bf4f.png',
    name: 'axe5',
  },
  {
    src: 'https://static.cobaltlab.tech/images/a7b8fd09600a5ce5a9564db1d3de285ec6e20b9dd5d10135e2188f14a443380b.png',
    name: 'pickaxe1',
  },
  {
    src: 'https://static.cobaltlab.tech/images/9ee095c64a30af3d9d1b6322773980cf299149112c3fa35e25934874a8fc279c.png',
    name: 'pickaxe2',
  },
  {
    src: 'https://static.cobaltlab.tech/images/5fccc85018fe218f21060ecb0938a98fa61016fc77691a42049ebbfa11885825.png',
    name: 'pickaxe3',
  },
  {
    src: 'https://static.cobaltlab.tech/images/914c84065538c00950da851e18c2b979ea92eeae43fd25d74d6b866fcb0e4b87.png',
    name: 'pickaxe4',
  },
  {
    src: 'https://static.cobaltlab.tech/images/097425200b1104a7ff5794f2d83977dd3ef7c0b1410c0eeff2662cdd201a4f2b.png',
    name: 'pickaxe5',
  },
  {
    src: 'https://static.cobaltlab.tech/images/c390fa4a3872abd5333229b07640738c8d475a26ceab05deb792c189253db1f3.png',
    name: 'pickaxe6',
  },
  {
    src: 'https://static.cobaltlab.tech/images/75fe1305ab6bc97854ab96b27e2f98fa3bd3f5e50742fd7e49a11f4825248ac1.png',
    name: 'pickaxe7',
  },
  {
    src: 'https://static.cobaltlab.tech/images/7d5457d1da8d175acb113e90543b32ab8d34fe0b365f094609ad7a54f86e06c9.png',
    name: 'pickaxe8',
  },
  {
    src: 'https://static.cobaltlab.tech/images/4c6083a85b4dc2441adee656bd519af6e2c44e279b00528da17f99d6e5a475ec.png',
    name: 'rock',
  }
] as const;

export const toolTypesByName = toolTypes.reduce<Record<string, string | undefined>>((acc, item) => {
  acc[item.name] = item.src;
  return acc;
}, {});

export const toolTypesBySrc = toolTypes.reduce<Record<string, string | undefined>>((acc, item) => {
  acc[item.src] = item.name;
  return acc;
}, {});