import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  classic = signal([
    {
      name: 'Classic Black Cap',
      price: 19.99,
      img: 'https://media.istockphoto.com/id/1319142658/photo/black-baseball-hat.webp?a=1&b=1&s=612x612&w=0&k=20&c=6IZGnObNn3KUPGQXCENSnXtKxtDmg9V63DSksyBoQgE='
    },
    {
      name: 'Classic Blue Cap',
      price: 21.99,
      img: 'data:image/jpeg;base64,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'
    },
    {
      name: 'Classic Red Cap',
      price: 20.99,
      img: 'data:image/jpeg;base64,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'
    },
    {
      name: 'Classic White Cap',
      price: 18.99,
      img: 'https://media.istockphoto.com/id/898398692/photo/white-hat.jpg?s=612x612&w=0&k=20&c=8wlK0AnL7TqE7Y3p7TLO3joj9---IapYK-_Tn_QVbqs='
    },
    {
      name: 'Classic White Cap',
      price: 22.99,
      img: 'https://media.istockphoto.com/id/964313670/photo/cap-on-white-background.jpg?s=612x612&w=0&k=20&c=jNsrpNTAh1j58BcVUPV5opKEvMoZV9LobrdDSP8nh7w='
    },
    {
      name: 'Classic Olive Cap',
      price: 19.49,
      img: 'https://media.istockphoto.com/id/898398692/photo/white-hat.jpg?s=612x612&w=0&k=20&c=8wlK0AnL7TqE7Y3p7TLO3joj9---IapYK-_Tn_QVbqs='
    }
  ]);

  snapback = signal([
    {
      name: 'Snapback White Logo',
      price: 24.99,
      img: 'https://media.istockphoto.com/id/636241652/photo/white-empty-baseball-cap.jpg?s=612x612&w=0&k=20&c=QjABC7pfgMAfUxcddaQT1TaOKc8kho0cR2Yl65CJRYI='
    },
    {
      name: 'Snapback Red Script',
      price: 26.99,
      img: 'https://media.istockphoto.com/id/909956104/photo/red-baseball-cap-mock-up-blank-hat-template-isolated-on-white-background-3d-rendering.jpg?s=612x612&w=0&k=20&c=dpNrOe_a-1kVZUUIXn3JHNgJ3CHIzAsIcmDpFzOgA4I='
    },
    {
      name: 'Snapback White Classic',
      price: 23.49,
      img: 'https://media.istockphoto.com/id/1220512492/photo/blank-white-jeans-snapback-mockup-side-view.jpg?s=612x612&w=0&k=20&c=LGkJF-z6wPsyoGDf5vI1DLcVevvMmlNlt48PwK57wpk='
    },
    {
      name: 'Snapback Black Tag',
      price: 25.99,
      img: 'https://media.istockphoto.com/id/1184218578/vector/vector-3d-realistic-render-black-blank-baseball-snapback-cap-icon-closeup-isolated-on-white.jpg?s=612x612&w=0&k=20&c=3OzJaWF2qCbYoJzwrlRO3w4IbHta1Bn7Jc4HG0QcenU='
    },
    {
      name: 'Snapback Camo',
      price: 28.99,
      img: 'https://media.istockphoto.com/id/184351921/photo/baseball-trucker-cap.jpg?s=612x612&w=0&k=20&c=XvZl1rZPdfSVPO6APSHQpVSx65CECjTw01Qm-4j8Otk='
    },
    {
      name: 'Snapback Grey Urban',
      price: 22.49,
      img: 'https://media.istockphoto.com/id/1480922000/photo/side-view-realistic-cap-mock-up-in-green-khaki-texture-is-a-high-resolution-hat-mockup-to.jpg?s=612x612&w=0&k=20&c=v36a3Qg7ttnP2E3GmoMr-NODcsXgy3ekwX9fuldgwe8='
    }
  ]);

  truck = signal([
    {
      name: 'Truck Mesh Green',
      price: 17.99,
      img: 'https://media.istockphoto.com/id/1480922000/photo/side-view-realistic-cap-mock-up-in-green-khaki-texture-is-a-high-resolution-hat-mockup-to.jpg?s=612x612&w=0&k=20&c=v36a3Qg7ttnP2E3GmoMr-NODcsXgy3ekwX9fuldgwe8='
    },
    {
      name: 'Truck Mesh White',
      price: 18.99,
      img: 'https://media.istockphoto.com/id/1184962940/photo/blank-plain-cap-hat-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RYDIZQyQFsFc4wnCiKSBHL6D7kXAa-hu_rAbx0g08qg='
    },
    {
      name: 'Truck White Logo',
      price: 19.49,
      img: 'data:image/jpeg;base64,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'
    },
    {
      name: 'Truck White Strapback',
      price: 20.99,
      img: 'https://media.istockphoto.com/id/1163958328/photo/trucker-hat-or-mesh-cap-isolated.jpg?s=612x612&w=0&k=20&c=BzcqPaIauBYBmPlAF-D7HJV6EOUTEhNfjIkXTYUUSlE='
    },
    {
      name: 'Truck Classic Black',
      price: 21.99,
      img: 'https://media.istockphoto.com/id/184351921/photo/baseball-trucker-cap.jpg?s=612x612&w=0&k=20&c=XvZl1rZPdfSVPO6APSHQpVSx65CECjTw01Qm-4j8Otk='
    },
    {
      name: 'Truck Navy Foam',
      price: 19.99,
      img: 'https://media.istockphoto.com/id/1427572529/vector/blue-hip-hop-cap-with-mesh-four-panel-back-template.jpg?s=612x612&w=0&k=20&c=7T7-kVIz3wV6EFrr9wcAAyU8ZQx3ZSoxiGeE-0Nso-I='
    }
  ]);
}
