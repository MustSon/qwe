import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveHighscore = async (playerName: string, score: number) => {
  const now = Date.now();

  const lastSave = localStorage.getItem('lastSave');
  if (lastSave && now - parseInt(lastSave) < 60000) {
    alert("You already saved a score recently. Wait a bit.");
    return null;
  }
  const { data, error } = await supabase
    .from('highscores')
    .insert([{ name: playerName, score }]);

  if (error) {
    alert("Error saving highscore:");
    return null;
  }
  alert("Saved Score succesfully");
  

  localStorage.setItem('lastSave', now.toString());

  return data;
};



export const loadHighscores = async () => {
  const { data, error } = await supabase
    .from('highscores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error loading highscores:', error);
    return [];
  }
  return data;
};