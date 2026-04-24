import { CloudOff, Wifi } from 'lucide-react';

type ConnectivityBadgeProps = {
  isOnline: boolean;
};

export default function ConnectivityBadge({ isOnline }: ConnectivityBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
        isOnline
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-amber-200 bg-amber-50 text-amber-700'
      }`}
      title={isOnline ? 'İnternet bağlantısı var' : 'Çevrimdışı mod'}
    >
      {isOnline ? <Wifi size={14} /> : <CloudOff size={14} />}
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}
