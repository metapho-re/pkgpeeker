export const withViewTransition = (
  callback: () => void,
  onFinished?: () => void,
): void => {
  if (document.startViewTransition) {
    const transition = document.startViewTransition(callback);

    if (onFinished) {
      transition.finished.then(onFinished);
    }
  } else {
    callback();
    onFinished?.();
  }
};
