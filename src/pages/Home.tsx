import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';
import { DishCard } from '../components/DishCard';
import { DEFAULT_DISH_CAPACITY, dishes } from '../data/dishes';
import { appsScriptConfig, sheetConfig } from '../config';
import { useGoogleSheet } from '../hooks/useGoogleSheet';
import { summarizeResponses } from '../utils/responses';
import { YALDA_IMAGE_URL } from '../constants';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const descriptionSections = [
  {
    id: 'fa',
    title: 'توضیحات',
    bullets: [
      'لطفاً یکی از غذاهای زیر را انتخاب کنید و برای مهمانی شب یلدا همراه خود بیاورید.',
      'هر غذا ظرفیت محدودی دارد و پس از تکمیل ظرفیت قابل انتخاب نخواهد بود.',
      'برای مثال: اگر خانواده‌ چهار نفره هستید، لطفاً مقدار کافی برای چهار نفر بیاورید.',
    ],
  },
  {
    id: 'en',
    title: 'English Description',
    bullets: [
      'Please choose one dish from the list below to bring to the Yalda dinner.',
      'Each dish has limited spots and will be unavailable once full.',
      'For instance: If you are a family of four, please bring enough of your chosen dish for four people.',
    ],
  },
];

export default function Home() {
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [selectedDishIds, setSelectedDishIds] = useState<number[]>([]);
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const { endpoint, configured } = appsScriptConfig;
  const { columns } = sheetConfig;
  const {
    rows,
    loading: availabilityLoading,
    error: availabilityError,
  } = useGoogleSheet(endpoint && configured ? endpoint : undefined);

  const { dishCounts } = useMemo(
    () => summarizeResponses(rows, columns),
    [rows, columns],
  );

  const dishCountMap = useMemo(() => {
    const map = new Map<number, number>();
    dishCounts.forEach(({ dish, count }) => map.set(dish.id, count));
    return map;
  }, [dishCounts]);

  const fullyBookedSet = useMemo(() => {
    const set = new Set<number>();
    dishCounts.forEach(({ dish, count }) => {
      const limit = dish.capacity ?? DEFAULT_DISH_CAPACITY;
      if (limit && count >= limit) {
        set.add(dish.id);
      }
    });
    return set;
  }, [dishCounts]);

  useEffect(() => {
    if (!fullyBookedSet.size) {
      return;
    }
    setSelectedDishIds((prev) => prev.filter((id) => !fullyBookedSet.has(id)));
  }, [fullyBookedSet]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        navigate('/results');
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showSuccessModal, navigate]);

  const selectedDishNames = useMemo(
    () =>
      selectedDishIds
        .map((dishId) => dishes.find((dish) => dish.id === dishId)?.en)
        .filter(Boolean)
        .join(', '),
    [selectedDishIds],
  );

  const toggleDish = (dishId: number) => {
    if (fullyBookedSet.has(dishId)) {
      return;
    }
    setSelectedDishIds((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage('Please share your name before submitting.');
      return;
    }

    if (!selectedDishIds.length) {
      setMessage('Please choose at least one dish.');
      return;
    }

    if (!configured || !endpoint) {
      setMessage('Apps Script endpoint is missing. Ask the organizer to add it to the .env file.');
      return;
    }

    if (selectedDishIds.some((id) => fullyBookedSet.has(id))) {
      setMessage('One of your dishes just reached capacity. Please choose another option.');
      return;
    }

    const payload = {
      name: name.trim(),
      partner: partnerName.trim(),
      selectedDishes: selectedDishNames,
    };

    try {
      setStatus('submitting');
      setMessage('Sending your RSVP...');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Apps Script rejected the submission');
      }

      setStatus('success');
      setMessage('Thanks! Your dish selection has been shared.');
      setSelectedDishIds([]);
      setPartnerName('');
      setName('');
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('Could not submit the form. Please try again in a moment.');
    }
  };

  const showLoader = configured && availabilityLoading;

  if (showLoader) {
    return <LoadingScreen message="Loading available dishes..." />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <header className="text-center space-y-2">
        <p className="text-rose-500 text-sm font-semibold uppercase tracking-wide">Yalda Party - 21 Dec. 2025</p>
        <h1 className="text-3xl font-semibold text-gray-900">Food Selection Form</h1>
        <p className="text-gray-600 text-sm">
          Fill out the form below and coordinate what you will bring to dinner.
        </p>
      </header>

      <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-md text-sm leading-6 text-gray-700 space-y-3">
        <div className="space-y-3">
          {descriptionSections.map(({ id, title, bullets }, index) => (
            <details key={id} className="bg-white border border-gray-200 rounded-md" open={index === 0}>
              <summary className="cursor-pointer select-none px-4 py-2 text-sm font-semibold text-gray-900">
                {title}
              </summary>
              <ul
                className={`px-6 pb-4 pt-2 text-sm text-gray-700 space-y-2 list-disc ${
                  id === 'fa' ? 'pr-4' : 'pl-4'
                }`}
                dir={id === 'fa' ? 'rtl' : 'ltr'}
              >
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
        <p className="text-gray-500">
          Need to double-check existing selections?{' '}
          <a className="underline text-rose-500" href="/results">
            View the live list
          </a>
          .
        </p>
        <p className="text-gray-500 text-xs">
          Each dish closes automatically once six households sign up so we keep the menu balanced.
        </p>
      </div>

      {fullyBookedSet.size > 0 && (
        <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-md px-3 py-2">
          Some dishes are already full and have been disabled automatically.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <section>
          <h2 className="text-base font-semibold text-gray-900">Dishes</h2>
          <p className="text-sm text-gray-600">
            Pick one or more dishes you will prepare.{' '}
            {availabilityLoading ? 'Checking live availability...' : 'Availability updates in real time.'}
          </p>
          {availabilityError && (
            <p className="text-xs text-red-600 mt-1">
              Could not load the latest counts. Please refresh before submitting.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                checked={selectedDishIds.includes(dish.id)}
                onToggle={toggleDish}
                count={dishCountMap.get(dish.id) ?? 0}
                limit={dish.capacity ?? DEFAULT_DISH_CAPACITY}
                disabled={fullyBookedSet.has(dish.id)}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          <label className="text-sm text-gray-700">
            Your Name<span className="text-rose-500">*</span>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="text-sm text-gray-700">
            Partner / +1 name (optional)
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              value={partnerName}
              onChange={(event) => setPartnerName(event.target.value)}
              placeholder="e.g. Vida"
            />
          </label>
        </section>

        {message && (
          <div
            className={`text-sm rounded-md px-3 py-2 ${
              status === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : status === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-md py-2 text-sm font-medium transition-colors disabled:opacity-60"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-sm w-full text-center shadow-xl overflow-hidden">
            <img src={YALDA_IMAGE_URL} alt="Yalda" className="w-full h-48 object-cover" />
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Thanks for your contribution in Yalda Party in Porto
              </h3>
              <p className="text-sm text-gray-500">Redirecting to the live results...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
