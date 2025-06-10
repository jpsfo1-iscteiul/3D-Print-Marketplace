/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DESIGN_REGISTRY_ADDRESS: string
  readonly VITE_NFT_MARKETPLACE_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 