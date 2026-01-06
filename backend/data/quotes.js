const quotes = [
  { id: 1, author: "Maya Angelou", text: "You will face many defeats in life, but never let yourself be defeated." },
  { id: 2, author: "Albert Einstein", text: "Life is like riding a bicycle. To keep your balance, you must keep moving." },
  { id: 3, author: "Oscar Wilde", text: "Be yourself; everyone else is already taken." },
  { id: 4, author: "Nelson Mandela", text: "It always seems impossible until it is done." },
  { id: 5, author: "Marie Curie", text: "Nothing in life is to be feared, it is only to be understood." },
  { id: 6, author: "Yogi Berra", text: "When you come to a fork in the road, take it." },
  { id: 7, author: "Confucius", text: "It does not matter how slowly you go as long as you do not stop." },
  { id: 8, author: "Eleanor Roosevelt", text: "The future belongs to those who believe in the beauty of their dreams." },
  { id: 9, author: "Steve Jobs", text: "Stay hungry, stay foolish." },
  { id: 10, author: "Winston Churchill", text: "Success is not final, failure is not fatal: it is the courage to continue that counts." },
  { id: 11, author: "Bruce Lee", text: "The successful warrior is the average man, with laser-like focus." },
  { id: 12, author: "Leonardo da Vinci", text: "Simplicity is the ultimate sophistication." },
  { id: 13, author: "Audrey Hepburn", text: "Nothing is impossible. The word itself says 'I'm possible!'" },
  { id: 14, author: "Sun Tzu", text: "In the midst of chaos, there is also opportunity." },
  { id: 15, author: "Marcus Aurelius", text: "The happiness of your life depends upon the quality of your thoughts." },
  { id: 16, author: "Lao Tzu", text: "The journey of a thousand miles begins with one step." },
  { id: 17, author: "Amelia Earhart", text: "The most difficult thing is the decision to act, the rest is merely tenacity." },
  { id: 18, author: "Jane Austen", text: "There is no charm equal to tenderness of heart." },
  { id: 19, author: "Rumi", text: "What you seek is seeking you." },
  { id: 20, author: "Serena Williams", text: "A champion is defined not by their wins but by how they can recover when they fall." }
];

const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

module.exports = { quotes, getRandomQuote };