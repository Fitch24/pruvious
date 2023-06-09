import { Block as _Block } from '@pruvious-test/shared'
import { Pruvious } from '~~/.nuxt/imports'

type Block = Omit<_Block<Pruvious.BlockName>, 'name' | 'fields'>

export function defineBlock(config: Block) {}
