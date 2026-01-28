
import { supabase } from '../lib/supabase';
import { NewsArticle } from '../types';

export const dataService = {
  // Articles
  async getArticles(limit = 10) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as NewsArticle[];
  },

  async createArticle(article: Omit<NewsArticle, 'id'>) {
    const { data, error } = await supabase
      .from('news')
      .insert([article])
      .select();
    
    if (error) throw error;
    return data[0] as NewsArticle;
  },

  async deleteArticle(id: string) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Storage
  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Stats (simulées via agrégats si nécessaire)
  async getDashboardStats() {
    const { count: articlesCount } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    return {
      totalNews: articlesCount || 0,
      youthReached: 5200, // Exemple de data métier
      communitiesCount: 12,
      activeProjects: 8
    };
  }
};
