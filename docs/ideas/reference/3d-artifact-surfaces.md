# 3D Artifact Surfaces — thư viện tham khảo bề mặt viên knot

> Reference idea library · 2026-06-14 · repo `landing-page-list`
> Sinh ra từ brainstorm Waitlist template (hình khối: **flow knot** / TorusKnot trên `theme-infra`, hệ màu **Aurora**).
> Đây là **kho ý tưởng để tham khảo lần sau**, KHÔNG phải component production.
> Theo mô hình [template-factory](../template-factory.md): _templates-first, harvest-later_ — chỉ tách thành
> component thật khi một `kind` lặp ở 3 template (rule of three). Hiện mới dùng ở 1 trang → giữ ở dạng recipe.

## Lookbook chạy được

Mở `3d-artifact-surfaces.lookbook.html` cùng thư mục bằng trình duyệt → bấm các nút để xoay qua từng bề mặt
trực tiếp trên cùng một viên knot. Cần WebGL + mạng (three.js tải qua unpkg CDN).

## Vì sao có file này

Trong brainstorm, viên knot thuỷ tinh (`transmission:1`) bị "ăn" màu nền đơn sắc → trông như **khối đặc xanh phẳng**.
Bài học: khi nền đã đơn sắc, đừng tinh chỉnh tiếp kỹ thuật kính — **đổi hẳn loại bề mặt**. 6 hướng dưới đây là các
loại bề mặt đã thử nghiệm, mỗi cái xử lý ánh sáng theo cách khác nhau (khúc xạ / phản chiếu / phát xạ / unlit).

> ⚠️ Bỏ qua có chủ đích: **Plasma Core** (lõi tự phát sáng) — đã loại khỏi kho này theo yêu cầu, vì quá "ồn" / nổi
> so với tinh thần calm-premium của `theme-infra`.

## Khung dùng chung (shared scaffold)

Mọi recipe dưới đây dùng chung phần dựng cảnh — chỉ khác **vật liệu** gắn vào knot.

```js
// renderer
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

// môi trường phản chiếu (cần cho metal/glass/holo; vô hại với unlit)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// camera
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0, 4.6);

// hình khối chuẩn — flow knot
const geo = new THREE.TorusKnotGeometry(1.0, 0.33, 240, 36);

// backdrop đa sắc (quan trọng cho glass/frosted; ambient nhẹ cho phần còn lại)
// 5 vũng radial: mint sáng (góc trên-trái) · aqua-teal · emerald sâu · gold · tím mờ
const pools = [
  [150, 170, 300, "rgba(150,255,228,.9)"],
  [385, 250, 230, "rgba(46,196,210,.55)"],
  [300, 360, 240, "rgba(11,185,138,.5)"],
  [240, 470, 210, "rgba(255,207,107,.5)"],
  [440, 430, 150, "rgba(150,120,255,.28)"],
];

// đèn — rim màu cho bề mặt phản chiếu
key:     DirectionalLight(0xeafff6, 2.8) @ (4, 5, 6)
rimGold: DirectionalLight(0xffcf6b, 1.3) @ (-5, -3, -4)
rimAqua: DirectionalLight(0x49e0d8, 1.1) @ (5, -4, -3)
ambient: AmbientLight(0x183f3a, 0.4)
```

**Gotcha three.js:** `Object3D.position` là READ-ONLY → luôn `.position.set(x,y,z)`, không `Object.assign(obj,{position})`.

---

## ⭐ Wireframe Flow — ĐÃ CHỌN cho trang Waitlist

Lưới dây emerald phát sáng bao quanh một lõi tối đặc — gợi "dữ liệu chảy qua lớp tin cậy". Nhẹ, kỹ thuật, hợp tinh
thần infra. **Unlit** (`MeshBasicMaterial`) nên không phụ thuộc đèn/môi trường → KHÔNG bao giờ ăn màu nền.

```js
// nhóm 2 mesh chung 1 geometry
const fill = new THREE.Mesh(
  geo,
  new THREE.MeshBasicMaterial({ color: 0x021712 }),
);
fill.scale.setScalar(0.985); // hơi nhỏ để lưới nằm sát bề mặt
const wire = new THREE.Mesh(
  geo,
  new THREE.MeshBasicMaterial({
    color: 0x5dffce,
    wireframe: true,
    transparent: true,
    opacity: 0.9,
  }),
);
const knot = new THREE.Group();
knot.add(fill, wire);
```

- **Khi dùng:** muốn cảm giác kỹ thuật / data-flow; nền đơn sắc; cần nhẹ (không transmission, không cần env/đèn).
- **Lưu ý:** unlit nên "phẳng" về chiều sâu — bù bằng xoay liên tục để đường lưới đọc được khối.

---

## 🧊 Frosted satin — kính mờ

Kính mờ sương mịn, mềm, bán trong. Tinh tế, trầm — giấu cái phẳng bằng cách khuếch tán ánh sáng (roughness cao trên
transmission). Vẫn là kính nhưng nhám nên ít "ăn màu nền" hơn glass trong.

```js
new THREE.MeshPhysicalMaterial({
  transmission: 1,
  thickness: 1.6,
  roughness: 0.5,
  ior: 1.4,
  color: 0xeafff6,
  attenuationColor: 0x9ff0d6,
  attenuationDistance: 3,
  clearcoat: 0.4,
  clearcoatRoughness: 0.5,
  envMapIntensity: 1.1,
});
```

- **Khi dùng:** muốn sang/trầm, nền có ≥2 màu để khúc xạ đọc được.
- **Lưu ý:** vẫn là transmission → nền đơn sắc sẽ kéo về một khối; cần backdrop đa sắc.

---

## ✨ Frosted + Wire (FrostWire combo)

Kết hợp: vỏ kính mờ sương bán trong + lưới dây emerald phát sáng (additive) bên trong. Khối mềm của frosted cho chiều
sâu, lưới wireframe cho cấu trúc. Cân bằng giữa "mềm" và "kỹ thuật".

```js
const shell = new THREE.Mesh(
  geo,
  new THREE.MeshPhysicalMaterial({
    transmission: 1,
    thickness: 1.4,
    roughness: 0.42,
    ior: 1.4,
    color: 0xeafff6,
    attenuationColor: 0x9ff0d6,
    attenuationDistance: 3.2,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
    envMapIntensity: 1.15,
  }),
);
const wire = new THREE.Mesh(
  geo,
  new THREE.MeshBasicMaterial({
    color: 0x6effd6,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  }),
);
wire.scale.setScalar(1.004); // lưới nằm ngay ngoài vỏ
```

- **Khi dùng:** muốn vừa mềm vừa có cấu trúc; bản "giàu" hơn Wireframe Flow thuần.
- **Lưu ý:** nặng hơn (transmission + 2 mesh); cần backdrop đa sắc cho lớp vỏ.

---

## 🌈 Holographic — màng dầu loang (oil-slick)

Bề mặt ĐỔI MÀU cầu vồng theo góc nhìn (emerald→gold→aqua→tím) nhờ iridescence cao trên nền metal tối. **Không trong
suốt** nên không bao giờ ăn màu nền. Premium & đặc biệt nhất.

```js
new THREE.MeshPhysicalMaterial({
  metalness: 0.45,
  roughness: 0.22,
  color: 0x07201b,
  clearcoat: 1,
  clearcoatRoughness: 0.14,
  iridescence: 1,
  iridescenceIOR: 2.1,
  iridescenceThicknessRange: [100, 900],
  envMapIntensity: 2.3,
  sheen: 1,
  sheenColor: 0x88ffe0,
});
```

- **Khi dùng:** muốn "wow" cao cấp, không lo nền; cần env map (RoomEnvironment) để loang màu.
- **Lưu ý:** cần môi trường phản chiếu; thiếu env sẽ ra tối thui.

---

## 🪞 Liquid Chrome — kim loại gương

Kim loại lỏng bóng như gương, ám sắc mint, phản chiếu môi trường. Sang, mạnh mẽ, dứt khoát — vibe "thanh khoản kim
loại". Phản chiếu chứ không khúc xạ → độc lập với nền.

```js
new THREE.MeshStandardMaterial({
  metalness: 1,
  roughness: 0.05,
  color: 0xc7f3e2,
  envMapIntensity: 2.1,
});
```

- **Khi dùng:** muốn mạnh/cứng/cao cấp; cần env map giàu chi tiết để gương có gì phản chiếu.
- **Lưu ý:** gương trơn → cần backdrop/đèn có cấu trúc, nếu không sẽ "trống".

---

## 💎 Glass crystal — pha lê trong (bản gốc)

Pha lê trong khúc xạ backdrop đa sắc. Đẹp KHI nền nhiều màu; dễ thành "khối đặc" khi nền đơn sắc (chính là vấn đề đã
gặp). Giữ lại để đối chiếu.

```js
new THREE.MeshPhysicalMaterial({
  transmission: 1,
  thickness: 0.9,
  roughness: 0.03,
  ior: 1.55,
  color: 0xffffff,
  attenuationColor: 0xaef5dc,
  attenuationDistance: 6,
  clearcoat: 1,
  clearcoatRoughness: 0.05,
  iridescence: 1,
  iridescenceIOR: 1.5,
  iridescenceThicknessRange: [120, 520],
  envMapIntensity: 1.9,
});
```

- **Khi dùng:** CHỈ khi backdrop chắc chắn đa sắc + nhiều tương phản.
- **Lưu ý (bài học):** `transmission` khúc xạ thứ phía sau → nền đơn sắc + `attenuationColor` mạnh = khối đục.

---

## Khi nào "harvest" thành component thật

Theo rule-of-three: khi `kind` "3D artifact" xuất hiện ở **3 template**, mới tách các bề mặt này thành component
props-hoá (vd `<Artifact surface="wireframe-flow" shape="knot" palette={...} />`) trong `@landing/sections`, với
`useReducedMotion` gate sẵn. Trước đó: dùng recipe ở đây, copy-tinh-chỉnh trong từng template.

Ghi nhận lần dùng đầu: **Waitlist (Aenor)** → surface `Wireframe Flow`, shape `flow knot`, palette `Aurora`.
Lần dùng tiếp theo nhớ cập nhật [harvest-log](../harvest-log.md) (nếu đã tạo) để đếm tiến tới rule-of-three.
