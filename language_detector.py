import re
import logging
from collections import Counter, defaultdict
import langdetect
from langdetect import detect, detect_langs
from langid.langid import LanguageIdentifier, model

class LanguageDetector:
    """Language detection using both traditional n-gram and pre-trained models"""
    
    def __init__(self):
        """Initialize the language detector"""
        self.identifier = LanguageIdentifier.from_modelstring(model, norm_probs=True)
        
        # Language code to name mapping
        self.language_names = {
            'en': 'English',
            'es': 'Spanish', 
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'hi': 'Hindi',
            'nl': 'Dutch',
            'sv': 'Swedish',
            'da': 'Danish',
            'no': 'Norwegian',
            'fi': 'Finnish',
            'pl': 'Polish',
            'cs': 'Czech',
            'hu': 'Hungarian',
            'tr': 'Turkish',
            'th': 'Thai',
            'vi': 'Vietnamese',
            'id': 'Indonesian',
            'ms': 'Malay',
            'tl': 'Filipino',
            'sw': 'Swahili',
            'am': 'Amharic',
            'he': 'Hebrew',
            'fa': 'Persian',
            'ur': 'Urdu',
            'bn': 'Bengali',
            'ta': 'Tamil',
            'te': 'Telugu',
            'ml': 'Malayalam',
            'kn': 'Kannada',
            'gu': 'Gujarati',
            'pa': 'Punjabi',
            'or': 'Odia',
            'as': 'Assamese',
            'mr': 'Marathi',
            'ne': 'Nepali',
            'si': 'Sinhala',
            'my': 'Myanmar',
            'km': 'Khmer',
            'lo': 'Lao',
            'ka': 'Georgian',
            'hy': 'Armenian',
            'az': 'Azerbaijani',
            'kk': 'Kazakh',
            'ky': 'Kyrgyz',
            'uz': 'Uzbek',
            'tk': 'Turkmen',
            'mn': 'Mongolian',
            'bo': 'Tibetan',
            'dz': 'Dzongkha',
            'eu': 'Basque',
            'ca': 'Catalan',
            'gl': 'Galician',
            'cy': 'Welsh',
            'ga': 'Irish',
            'gd': 'Scottish Gaelic',
            'is': 'Icelandic',
            'mt': 'Maltese',
            'sq': 'Albanian',
            'mk': 'Macedonian',
            'bg': 'Bulgarian',
            'hr': 'Croatian',
            'sr': 'Serbian',
            'bs': 'Bosnian',
            'sl': 'Slovenian',
            'sk': 'Slovak',
            'lv': 'Latvian',
            'lt': 'Lithuanian',
            'et': 'Estonian',
            'ro': 'Romanian',
            'el': 'Greek',
            'uk': 'Ukrainian',
            'be': 'Belarusian'
        }
    
    def extract_character_ngrams(self, text, n=2):
        """Extract character n-grams from text"""
        # Clean text - remove extra whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip().lower())
        
        # Generate n-grams
        ngrams = []
        for i in range(len(text) - n + 1):
            ngram = text[i:i+n]
            ngrams.append(ngram)
        
        return ngrams
    
    def detect_traditional(self, text):
        """Detect language using traditional n-gram approach with langid"""
        try:
            # Use langid which implements n-gram based detection
            lang_code, confidence = self.identifier.classify(text)
            
            # Get language name
            language_name = self.language_names.get(lang_code, lang_code.upper())
            
            # Convert confidence to percentage
            confidence_percentage = round(confidence * 100, 2)
            
            # Generate additional analysis with character n-grams
            bigrams = self.extract_character_ngrams(text, 2)
            trigrams = self.extract_character_ngrams(text, 3)
            
            # Count most common n-grams for analysis
            common_bigrams = Counter(bigrams).most_common(5)
            common_trigrams = Counter(trigrams).most_common(5)
            
            return {
                'language': language_name,
                'language_code': lang_code,
                'confidence': confidence_percentage,
                'method': 'Traditional N-gram Analysis',
                'analysis': {
                    'total_bigrams': len(bigrams),
                    'unique_bigrams': len(set(bigrams)),
                    'total_trigrams': len(trigrams),
                    'unique_trigrams': len(set(trigrams)),
                    'common_bigrams': common_bigrams,
                    'common_trigrams': common_trigrams
                }
            }
        
        except Exception as e:
            logging.error(f"Traditional detection error: {str(e)}")
            raise Exception(f"Traditional detection failed: {str(e)}")
    
    def detect_pretrained(self, text):
        """Detect language using pre-trained model (langdetect)"""
        try:
            # Get detailed probabilities
            lang_probs = detect_langs(text)
            
            # Get the most likely language
            most_likely = lang_probs[0]
            lang_code = most_likely.lang
            confidence = most_likely.prob
            
            # Get language name
            language_name = self.language_names.get(lang_code, lang_code.upper())
            
            # Convert confidence to percentage
            confidence_percentage = round(confidence * 100, 2)
            
            # Get alternative predictions
            alternatives = []
            for lang_prob in lang_probs[:5]:  # Top 5 alternatives
                alt_name = self.language_names.get(lang_prob.lang, lang_prob.lang.upper())
                alternatives.append({
                    'language': alt_name,
                    'language_code': lang_prob.lang,
                    'confidence': round(lang_prob.prob * 100, 2)
                })
            
            return {
                'language': language_name,
                'language_code': lang_code,
                'confidence': confidence_percentage,
                'method': 'Pre-trained Model (Google langdetect)',
                'alternatives': alternatives,
                'total_candidates': len(lang_probs)
            }
        
        except Exception as e:
            logging.error(f"Pre-trained detection error: {str(e)}")
            raise Exception(f"Pre-trained detection failed: {str(e)}")
    
    def get_language_name(self, lang_code):
        """Get full language name from language code"""
        return self.language_names.get(lang_code, lang_code.upper())
