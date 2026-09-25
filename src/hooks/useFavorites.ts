import { useCallback, useEffect, useState } from 'react';
import { supabase, type FavoriteRow } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching favorites:', error.message);
    }
    setFavorites(data as FavoriteRow[] ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorited = useCallback(
    (toolSlug: string) => favorites.some((f) => f.tool_slug === toolSlug),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (toolSlug: string) => {
      if (!user) return;
      const existing = favorites.find((f) => f.tool_slug === toolSlug);
      if (existing) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
        if (error) {
          console.error('Error removing favorite:', error.message);
          return false;
        }
        setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        return false;
      } else {
        const { data, error } = await supabase
          .from('favorites')
          .insert({ tool_slug: toolSlug })
          .select()
          .maybeSingle();
        if (error) {
          console.error('Error adding favorite:', error.message);
          return false;
        }
        if (data) {
          setFavorites((prev) => [data as FavoriteRow, ...prev]);
        }
        return true;
      }
    },
    [user, favorites]
  );

  return { favorites, loading, isFavorited, toggleFavorite, refetch: fetchFavorites };
}
