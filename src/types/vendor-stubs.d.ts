/* Stub type declarations for packages used in the codebase but not installed as npm packages.
   These allow TypeScript compilation to succeed. Runtime behavior depends on
   the actual packages being installed if those features are needed. */

declare module 'antd' {
  export const Table: React.ComponentType<Record<string, unknown>>;
  export const Button: React.ComponentType<Record<string, unknown>>;
  export const Form: React.ComponentType<Record<string, unknown>> & {
    Item: React.ComponentType<Record<string, unknown>>;
    useForm: () => [unknown];
  };
  export const Input: React.ComponentType<Record<string, unknown>>;
  export const Modal: React.ComponentType<Record<string, unknown>>;
  export const Select: React.ComponentType<Record<string, unknown>> & {
    Option: React.ComponentType<Record<string, unknown>>;
  };
  export const Tabs: React.ComponentType<Record<string, unknown>> & {
    TabPane: React.ComponentType<Record<string, unknown>>;
  };
  export const Tag: React.ComponentType<Record<string, unknown>>;
  export const Space: React.ComponentType<Record<string, unknown>>;
  export const Dropdown: React.ComponentType<Record<string, unknown>>;
  export const Menu: React.ComponentType<Record<string, unknown>>;
  export const Spin: React.ComponentType<Record<string, unknown>>;
  export const Typography: {
    Text: React.ComponentType<Record<string, unknown>>;
    Title: React.ComponentType<Record<string, unknown>>;
  };
}

declare module 'react-chartjs-2' {
  export const Bar: React.ComponentType<Record<string, unknown>>;
  export const Line: React.ComponentType<Record<string, unknown>>;
  export const Pie: React.ComponentType<Record<string, unknown>>;
  export const Doughnut: React.ComponentType<Record<string, unknown>>;
}

declare module 'react-bootstrap' {
  export const Container: React.ComponentType<Record<string, unknown>>;
  export const Row: React.ComponentType<Record<string, unknown>>;
  export const Col: React.ComponentType<Record<string, unknown>>;
  export const Card: React.ComponentType<Record<string, unknown>> & {
    Body: React.ComponentType<Record<string, unknown>>;
    Title: React.ComponentType<Record<string, unknown>>;
  };
  export const Button: React.ComponentType<Record<string, unknown>>;
  export const Form: React.ComponentType<Record<string, unknown>> & {
    Group: React.ComponentType<Record<string, unknown>>;
    Label: React.ComponentType<Record<string, unknown>>;
    Control: React.ComponentType<Record<string, unknown>>;
    Check: React.ComponentType<Record<string, unknown>>;
  };
  export const Modal: React.ComponentType<Record<string, unknown>> & {
    Header: React.ComponentType<Record<string, unknown>>;
    Title: React.ComponentType<Record<string, unknown>>;
    Body: React.ComponentType<Record<string, unknown>>;
    Footer: React.ComponentType<Record<string, unknown>>;
  };
  export const Table: React.ComponentType<Record<string, unknown>>;
  export const Badge: React.ComponentType<Record<string, unknown>>;
  export const Alert: React.ComponentType<Record<string, unknown>>;
  export const Nav: React.ComponentType<Record<string, unknown>>;
  export const Navbar: React.ComponentType<Record<string, unknown>>;
  export const Accordion: React.ComponentType<Record<string, unknown>>;
  export const ListGroup: React.ComponentType<Record<string, unknown>> & {
    Item: React.ComponentType<Record<string, unknown>>;
  };
  export const Spinner: React.ComponentType<Record<string, unknown>>;
}

declare module 'react-rnd' {
  interface RndProps {
    children?: React.ReactNode;
    [key: string]: unknown;
  }
  export const Rnd: React.ComponentType<RndProps>;
  export default Rnd;
}

declare module '@react-three/rapier' {
  export const Physics: React.ComponentType<Record<string, unknown>>;
  export const RigidBody: React.ComponentType<Record<string, unknown>>;
  export const CuboidCollider: React.ComponentType<Record<string, unknown>>;
  export const BallCollider: React.ComponentType<Record<string, unknown>>;
  export function useRapier(): unknown;
}
