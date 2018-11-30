import chai from 'chai';
import {createMockProvider, deployContract, getWallets, contractWithWallet, link} from '../../lib/waffle';
import BasicTokenMock from './build/BasicTokenMock';
import MyLibrary from './build/MyLibrary';
import LibraryConsumer from './build/LibraryConsumer';
import solidity from '../../lib/matchers';

chai.use(solidity);
const {expect} = chai;

describe('Example', () => {
  let provider;
  let token;
  let wallet;
  let walletTo;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, walletTo] = await getWallets(provider);
    token = await deployContract(wallet, BasicTokenMock, [wallet.address, 1000]);
  });

  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(wallet.address)).to.eq(1000);
  });

  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo.address, 7);
    expect(await token.balanceOf(walletTo.address)).to.eq(7);
  });

  it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo.address, 7))
      .to.emit(token, 'Transfer')
      .withArgs(wallet.address, walletTo.address, 7);
  });

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo.address, 1007)).to.be.reverted;
  });

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = contractWithWallet(token, walletTo);
    await expect(tokenFromOtherWallet.transfer(wallet.address, 1))
      .to.be.revertedWith('Not enough balance on sender account');
  });

  it.only('should use library to add 7', async() => {
    const myLibrary = await deployContract(wallet, MyLibrary, []);
    link(LibraryConsumer, 'MyLibrary', myLibrary.address);
    const libraryConsumer = await deployContract(wallet, LibraryConsumer, []);
    expect(await libraryConsumer.useLibrary(3)).to.eq(10);
  });
});
