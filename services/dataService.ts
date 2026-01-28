
import { supabase } from '../lib/supabase';
import { NewsArticle, ContentBlock, Page, SiteSetting } from '../types';

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

  async getArticle(id: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as NewsArticle;
  },

  async createArticle(article: Partial<NewsArticle>) {
    const { data, error } = await supabase
      .from('news')
      .upsert(article)
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

  async getDashboardStats() {
    const { count: articlesCount } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    return {
      totalNews: articlesCount || 0,
      youthReached: 5200,
      communitiesCount: 12,
      activeProjects: 8
    };
  },

  // Content Blocks
  async getContentBlocks(page?: string, section?: string) {
    let query = supabase.from('content_blocks').select('*').order('order_index');
    if (page) query = query.eq('page', page);
    if (section) query = query.eq('section', section);
    const { data, error } = await query;
    if (error) throw error;
    return data as ContentBlock[];
  },

  async getContentBlock(key: string) {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('key', key)
      .single();
    if (error) throw error;
    return data as ContentBlock;
  },

  async upsertContentBlock(block: Partial<ContentBlock> & { key: string }) {
    const { data, error } = await supabase
      .from('content_blocks')
      .upsert(block, { onConflict: 'key' })
      .select();
    if (error) throw error;
    return data[0] as ContentBlock;
  },

  async deleteContentBlock(id: string) {
    const { error } = await supabase
      .from('content_blocks')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Pages
  async getPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('title');
    if (error) throw error;
    return data as Page[];
  },

  async getPage(slug: string) {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (error) throw error;
    return data as Page;
  },

  async upsertPage(page: Partial<Page> & { slug: string; title: string }) {
    const { data, error } = await supabase
      .from('pages')
      .upsert(page, { onConflict: 'slug' })
      .select();
    if (error) throw error;
    return data[0] as Page;
  },

  async deletePage(id: string) {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Site Settings
  async getSiteSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');
    if (error) throw error;
    return data as SiteSetting[];
  },

  async getSiteSetting(key: string) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', key)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as SiteSetting | null;
  },

  async upsertSiteSetting(setting: { key: string; value: string; type?: string }) {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ ...setting, type: setting.type || 'text' }, { onConflict: 'key' })
      .select();
    if (error) throw error;
    return data[0] as SiteSetting;
  }
};
