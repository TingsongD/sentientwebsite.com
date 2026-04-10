/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTIENT_WIDGET_ORIGIN?: string
  readonly VITE_SENTIENT_INSTALL_KEY?: string
  readonly NEXT_PUBLIC_SENTIENT_WIDGET_ORIGIN?: string
  readonly NEXT_PUBLIC_SENTIENT_INSTALL_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
