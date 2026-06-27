import RouteTransition from "@/components/transitions/RouteTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}