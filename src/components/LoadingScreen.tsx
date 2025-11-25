import { YALDA_IMAGE_URL } from '../constants';

interface LoadingScreenProps {
  message: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-6 px-4">
      <img
        src={YALDA_IMAGE_URL}
        alt="Yalda celebration"
        className="w-full max-w-md rounded-2xl shadow-lg object-cover"
      />
      <div>
        <p className="text-rose-500 font-semibold uppercase tracking-[0.3em] text-xs mb-2">
          Yalda Night
        </p>
        <h2 className="text-2xl font-semibold text-gray-900">{message}</h2>
        <p className="text-sm text-gray-500 mt-2">Please hang tight while we sync with the kitchen.</p>
      </div>
    </div>
  );
}
