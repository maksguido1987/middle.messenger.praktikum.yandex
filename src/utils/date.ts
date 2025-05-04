export const formatMessageDate = (date: string): string => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
  } else if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Вчера ${messageDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;
  } else {
    return `${messageDate.getDate()} ${months[messageDate.getMonth()]} ${messageDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'})}`;
  }
};
