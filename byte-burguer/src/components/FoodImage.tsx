import { burgerImage } from '../data/products';
export default function FoodImage({ src, name }: {
    src: string;
    name: string;
}) {
    return <img src={src || burgerImage} alt={name} loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/food-placeholder.svg'; }}/>;
}
