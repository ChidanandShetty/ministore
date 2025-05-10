import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../context/CartContext';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your Cart</h2>

      {cart.length === 0 ? (
        <p className={styles.empty}>Your cart is empty.</p>
      ) : (
        cart.map((item: CartItem) => (
          <div key={item.productId} className={styles.cartItem}>
            <div className={styles.itemDetails}>
              <h4 className={styles.itemTitle}>{item.title}</h4>
              <p className={styles.itemPrice}>${item.price}</p>

              <div className={styles.quantityControl}>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                  }
                  disabled={item.quantity <= 1}
                >
                  ➖
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                  ➕
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.productId)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>

            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className={styles.itemImage}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CartPage;
