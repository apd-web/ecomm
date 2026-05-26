import { Button, Card } from "@ecomm/ui";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-start gap-3">
      <h3 className="text-title font-semibold">{title}</h3>
      <p className="text-sm text-muted">{message}</p>
      {actionLabel && onAction ? (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
