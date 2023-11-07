import { setTimeout as timeout } from 'timers/promises';

export function debounce(
  cb: (...args: any[]) => void,
  time: number
) {
  let controller: AbortController;

  return async (...args: any[]) => {
    if (controller) {
      controller.abort();
    }

    controller = new AbortController();

    try {
      await timeout(time, null, { signal: controller.signal });
      cb(...args);
    } catch {
      //
    }
  };
}
