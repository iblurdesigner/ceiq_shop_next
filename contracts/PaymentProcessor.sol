pragma solidity ^0.8.15;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract PaymentProcessor {
    address public admin;
    IERC20 public dai;

    constructor( address adminAddress, address daiAddress) public {
        admin = adminAddress;
        dai = IERC20(daiAddress);
    }
}
