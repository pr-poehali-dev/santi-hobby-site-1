import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const categories = ['Все товары', 'Рисование', 'Рукоделие', 'Моделирование', 'Скрапбукинг'];

const products: Product[] = [
  { id: 1, name: 'Набор акриловых красок', price: 1299, category: 'Рисование', image: '/placeholder.svg' },
  { id: 2, name: 'Холст 30×40 см', price: 450, category: 'Рисование', image: '/placeholder.svg' },
  { id: 3, name: 'Набор кистей 12 шт', price: 890, category: 'Рисование', image: '/placeholder.svg' },
  { id: 4, name: 'Пряжа мериносовая', price: 350, category: 'Рукоделие', image: '/placeholder.svg' },
  { id: 5, name: 'Крючки для вязания', price: 280, category: 'Рукоделие', image: '/placeholder.svg' },
  { id: 6, name: 'Набор для вышивания', price: 1590, category: 'Рукоделие', image: '/placeholder.svg' },
  { id: 7, name: 'Сборная модель танка', price: 2100, category: 'Моделирование', image: '/placeholder.svg' },
  { id: 8, name: 'Клей для моделей', price: 220, category: 'Моделирование', image: '/placeholder.svg' },
  { id: 9, name: 'Декоративная бумага А4', price: 320, category: 'Скрапбукинг', image: '/placeholder.svg' },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('Все товары');
  const [cart, setCart] = useState<CartItem[]>([]);

  const filteredProducts = selectedCategory === 'Все товары' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold font-heading">Санти Хобби</h1>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setActiveSection('home')} className="text-sm font-medium hover:text-primary transition-colors">Главная</button>
            <button onClick={() => setActiveSection('catalog')} className="text-sm font-medium hover:text-primary transition-colors">Каталог</button>
            <button onClick={() => setActiveSection('about')} className="text-sm font-medium hover:text-primary transition-colors">О нас</button>
            <button onClick={() => setActiveSection('delivery')} className="text-sm font-medium hover:text-primary transition-colors">Доставка</button>
            <button onClick={() => setActiveSection('contacts')} className="text-sm font-medium hover:text-primary transition-colors">Контакты</button>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="font-heading">Корзина</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-6">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">Корзина пуста</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={12} />
                              </Button>
                              <span className="text-sm w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={12} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 ml-auto"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Итого:</span>
                      <span>{totalAmount} ₽</span>
                    </div>
                    <Button className="w-full" size="lg">Оформить заказ</Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main>
        {activeSection === 'home' && (
          <>
            <section className="py-20 px-4 animate-fade-in">
              <div className="container max-w-4xl text-center">
                <h2 className="text-5xl font-bold font-heading mb-6">Всё для вашего хобби</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Качественные материалы для творчества и рукоделия по доступным ценам
                </p>
                <Button size="lg" onClick={() => setActiveSection('catalog')} className="font-medium">
                  Перейти в каталог
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            </section>

            <section className="py-16 px-4 bg-muted/30">
              <div className="container">
                <h3 className="text-3xl font-bold font-heading mb-8 text-center">Популярные товары</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, 6).map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in">
                      <CardContent className="p-0">
                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                          <h4 className="font-semibold mb-2">{product.name}</h4>
                          <p className="text-xl font-bold text-primary">{product.price} ₽</p>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" onClick={() => addToCart(product)}>
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeSection === 'catalog' && (
          <section className="py-12 px-4 animate-fade-in">
            <div className="container">
              <h2 className="text-4xl font-bold font-heading mb-8">Каталог товаров</h2>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                        <h4 className="font-semibold mb-2">{product.name}</h4>
                        <p className="text-xl font-bold text-primary">{product.price} ₽</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" onClick={() => addToCart(product)}>
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        В корзину
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section className="py-12 px-4 animate-fade-in">
            <div className="container max-w-3xl">
              <h2 className="text-4xl font-bold font-heading mb-6">О нас</h2>
              <div className="prose prose-lg">
                <p className="text-muted-foreground mb-4">
                  Санти Хобби — магазин для творческих людей, которые ценят качество и удобство. Мы собрали лучшие материалы для различных видов хобби в одном месте.
                </p>
                <p className="text-muted-foreground mb-4">
                  Наша миссия — сделать творчество доступным каждому. Мы тщательно отбираем товары от проверенных производителей и предлагаем их по честным ценам.
                </p>
                <p className="text-muted-foreground">
                  Уже более 5 лет мы помогаем художникам, рукодельницам и любителям моделирования находить всё необходимое для реализации их творческих идей.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'delivery' && (
          <section className="py-12 px-4 animate-fade-in">
            <div className="container max-w-3xl">
              <h2 className="text-4xl font-bold font-heading mb-6">Доставка</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon name="Truck" size={32} className="text-primary mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Курьерская доставка</h3>
                        <p className="text-muted-foreground">Доставка по городу в течение 1-2 дней. Стоимость — 300 ₽. Бесплатно при заказе от 3000 ₽.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon name="MapPin" size={32} className="text-primary mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Пункты выдачи</h3>
                        <p className="text-muted-foreground">Забрать заказ можно в одном из наших пунктов выдачи. Доставка до пункта — бесплатно.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Icon name="Package" size={32} className="text-primary mt-1" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Почта России</h3>
                        <p className="text-muted-foreground">Отправка по всей России. Срок доставки 5-14 дней в зависимости от региона. Стоимость рассчитывается индивидуально.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contacts' && (
          <section className="py-12 px-4 animate-fade-in">
            <div className="container max-w-3xl">
              <h2 className="text-4xl font-bold font-heading mb-6">Контакты</h2>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Icon name="Phone" size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold">Телефон</p>
                        <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Icon name="Mail" size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-muted-foreground">info@santi-hobby.ru</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Icon name="MapPin" size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold">Адрес</p>
                        <p className="text-muted-foreground">г. Москва, ул. Творческая, д. 15</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Icon name="Clock" size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold">Режим работы</p>
                        <p className="text-muted-foreground">Пн-Пт: 10:00 - 20:00, Сб-Вс: 11:00 - 18:00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t mt-20 py-8 px-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Санти Хобби. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
