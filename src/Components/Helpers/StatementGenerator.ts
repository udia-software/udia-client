const U = ["UNIVERSE", "USER", "UDIA"];
const D = ["DREAMS", "DENOTES", "DEALS", "DECIDES"];
const I = ["I"];
const A = ["ACT", "AWAKEN", "ACTUALIZE"];

const randEle = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)];

const UdiaStatement = () => {
  return `${randEle(U)} ${randEle(D)} ${randEle(I)} ${randEle(A)}`;
};

export default UdiaStatement;
