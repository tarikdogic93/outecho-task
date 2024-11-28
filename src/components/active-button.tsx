import { Button, ButtonProps } from "@/components/ui/button";

export function ActiveButton(props: ButtonProps) {
  return (
    <div className="rounded-lg bg-gradient-to-tr from-teal-500 via-purple-500 to-orange-500 p-0.5">
      <Button
        className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
    </div>
  );
}
