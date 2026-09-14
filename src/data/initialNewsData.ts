import { NewsArticle } from '../types/news';
import { generateMassiveNewsCatalog } from './massiveNewsCatalog';

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = generateMassiveNewsCatalog();
