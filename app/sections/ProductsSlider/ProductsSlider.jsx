import {
  Container,
  ProductsSlider as ProductsSliderComponent,
} from '~/components';

import {Schema} from './ProductsSlider.schema';

export function ProductsSlider({cms}) {
  return (
    <Container container={cms.container}>
      <ProductsSliderComponent cms={cms} />
    </Container>
  );
}

ProductsSlider.displayName = 'ProductsSlider';
ProductsSlider.Schema = Schema;
