const Vote = artifacts.require('Vote');

//const TodoList = artifacts.require('./TodoList.sol')

contract('Vote', (accounts) => {
  before(async () => {
    this.vote = await Vote.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.vote.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('whether it lists votes: ', async () => {
    const voteCount = await this.vote.voteCount()
    const vt = await this.vote.tasks(voteCount)
    assert.equal(vt.id.toNumber(), voteCount.toNumber())
    assert.equal(vt.eventId, 1)
    assert.equal(vt.vote, 1)
    assert.equal(voteCount.toNumber(), 1)
  })
})