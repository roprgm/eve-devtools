import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { type EveDevtools, mount } from "@/mount";

const DevtoolsContext = createContext<EveDevtools | undefined>(undefined);

type EveDevtoolsProviderProps = {
  children?: ReactNode;
  // Set to false to skip mounting, e.g. outside development builds.
  enabled?: boolean;
};

export function EveDevtoolsProvider({
  children,
  enabled = true,
}: EveDevtoolsProviderProps) {
  const [devtools, setDevtools] = useState<EveDevtools>();

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const instance = mount();
    setDevtools(instance);
    return () => {
      setDevtools(undefined);
      instance.unmount();
    };
  }, [enabled]);

  return createElement(DevtoolsContext.Provider, { value: devtools }, children);
}

// Returns the devtools handle, or undefined until the provider has mounted it.
export function useEveDevtools(): EveDevtools | undefined {
  return useContext(DevtoolsContext);
}
