import { WarpFactory } from 'warp-contracts'

export const isVouched = async (address: string) => {
  const warp = WarpFactory.forMainnet()
  const contract = warp.contract('_z0ch80z_daDUFqC9jHjfOL8nekJcok4ZRkE_UesYsk')

  const { cachedValue }: any = await contract.readState()
  let res: boolean | undefined

  if (cachedValue.state.vouched[address]) {
    res = cachedValue.state.vouched[address].find((obj: any) => obj.service === "jk0aaivTdKvzeLB_RhpC_ZUoy9CnY2trlEuHQVXulDQ")
  }

  return res !== undefined
}