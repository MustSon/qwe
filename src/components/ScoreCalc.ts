export function getFeedback(duration: number, firstPlayInSequence: boolean, gameInterval: number) {
  let text: string = '';
  let multi: number = 1;
  let color: string = '#ff4500'; 
  let keepCombo: boolean = false;

  if ((duration >= gameInterval-35 && duration <= gameInterval+35)) {
    text = 'PERFECT!';
    multi = 5;
    color = '#0f0';
  } else if (duration >= gameInterval-100 && duration <= gameInterval+100) {
    text = 'OK';
    multi = 3;
    color = '#eaff06ff'; 
  } else if (firstPlayInSequence) {
    text = 'TOO LATE';
    multi = 2;
    color = '#ff4500';
  } else {
    text = 'MISS';
    color = '#ff4500';
  }

  return { text, multi, color };
}
