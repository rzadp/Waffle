pragma solidity ^0.4.24;


library MyLibrary {
  struct Tuple {
    uint first;
    uint second;
  }

  function sevenify(uint _number) public pure returns (uint) {
    return _number + 7;
  }

  function sevenifyTuple(Tuple storage tuple) public {
    tuple.first = 7;
    tuple.second = 7;
  }
}
