# 📘 Dokumentasi Proyek: Sistem Manajemen Produk & Pengguna

## 📌 Deskripsi Umum

Aplikasi ini adalah sistem manajemen produk dan pengguna berbasis web dengan arsitektur RESTful API. Sistem mendukung fitur CRUD lengkap, upload gambar, serta filtering, pagination, dan limit baik melalui API maupun antarmuka pengguna (views).

## ⚙️ Teknologi yang Digunakan

| Teknologi  | Deskripsi                         |
| ---------- | --------------------------------- |
| Express.js | Framework web backend             |
| Prisma ORM | Mapping data ke PostgreSQL        |
| EJS        | Template engine untuk tampilan    |
| Multer     | Middleware upload gambar          |
| ImageKit   | Penyimpanan gambar berbasis cloud |
| dotenv     | Konfigurasi environment runtime   |
| Validator  | Validasi input produk & user      |

## 🧱 Teknik Konstruksi yang Diterapkan

| Teknologi                   | Implementasi                                     |
| --------------------------- | ------------------------------------------------ |
| Runtime Configuration       | Menggunakan `.env` dan `process.env`             |
| API                         | Endpoint RESTful pada `/api/v1`                  |
| Code Reuse / Library        | Modularisasi controller, middleware, dan service |
| Parameterization / Generics | Fungsi generik validasi dan paginasi             |

#### 1. Runtime Configuration

- Proyek ini menggunakan konfigurasi berbasis runtime melalui file `.env` dan akses ke variabel konfigurasi menggunakan `process.env`. Hal ini memungkinkan pengaturan yang fleksibel dan aman untuk berbagai lingkungan (misalnya, pengembangan, produksi).

- File `.env` digunakan untuk menyimpan variabel-variabel seperti konfigurasi database, kredensial API, dan rahasia lainnya. Dengan mengakses konfigurasi ini melalui `process.env`, kita dapat dengan mudah menyesuaikan pengaturan aplikasi di berbagai lingkungan tanpa mengubah kode.

- Contoh file `.env`

  ```js
  IMAGEKIT_PUBLIC_KEY = yourpublickey;
  IMAGEKIT_PRIVATE_KEY = yourprivatekey;
  IMAGEKIT_URL_ENDPOINT = yoururlendpoint;
  ```

- Contoh implementasi konfigurasi runtime:

  ```js
  const ImageKit = require("imagekit");

  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  module.exports = imagekit;
  ```

#### 2. API (Application Programming Interface)

- API pada proyek ini dibangun menggunakan arsitektur RESTful, memungkinkan aplikasi untuk mengelola data produk dan pengguna melalui endpoint standar yang mendukung operasi CRUD.

- Setiap entitas seperti produk dan pengguna memiliki endpoint untuk melakukan operasi CRUD melalui HTTP methods (`GET`, `POST`, `PUT`, `DELETE`). API dirancang untuk memungkinkan pagination dan filtering, baik untuk produk maupun pengguna, dengan menggunakan query parameters pada request URL.

- Contoh implementasi endpoint API:

  ```js
  router.get("/api/v1/products", productController.getAllProducts);
  ```

- Contoh response:

  ```js
  // Response 200 OK
  {
    "message": "Products fetched successfully",
    "data": [
      {
        "id": 6,
        "name": "Kemeja Abu-Abu",
        "price": 50000,
        "category": "Kemeja",
        "image": "https://ik.imagekit.io/1yelpitcv/download_aaOW_uX4w.jpg",
        "createdAt": "2025-05-03T12:27:57.741Z",
        "updatedAt": "2025-05-04T13:04:31.078Z"
      },
    ]
  }
  ```

#### 3. Code Reuse / Library

- Teknik ini digunakan untuk meningkatkan efisiensi dan maintainability dengan memecah aplikasi menjadi komponen-komponen modular seperti controller, service, dan middleware. Kode yang dapat digunakan kembali ini mengurangi duplikasi dan meningkatkan kualitas aplikasi secara keseluruhan.

- Controller: Menangani request dan response untuk setiap endpoint API. Controller bertugas menerima request dari client, memproses data menggunakan service, dan mengirimkan response.

- Contoh implementasi controller:

  ```js
  const ProductService = require("../services/productService");

  const getAllProducts = async (req, res) => {
    try {
      const { page = 1, limit = 8, category } = req.query;
      const products = await ProductService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        category,
      });
      if (products.length > 0) {
        return res.status(200).json({
          message: "Products fetched successfully",
          data: products,
        });
      }
      return res.status(404).json({ message: "No products found" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Failed to fetch products", details: err.message });
    }
  };
  module.exports = {
    getAllProducts,
  };
  ```

- Service: Berfungsi untuk logika bisnis, seperti interaksi dengan database atau operasi kompleks lainnya. Service memisahkan logika bisnis dari controller untuk memastikan controller tetap bersih dan fokus pada pengelolaan request.

- Contoh implementasi service:

  ```js
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const ProductService = {
    getAll: async ({ page = 1, limit = 8, category } = {}) => {
      const skip = (page - 1) * limit;
      const filter = category ? { category } : {};

      return prisma.product.findMany({
        where: filter,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    },
  };
  module.exports = ProductService;
  ```

- Middleware: Digunakan untuk memproses request sebelum mencapai controller, seperti validasi input dan autentikasi.

- Contoh implementasi middleware:

  ```js
  const productValidation = (req, res, next) => {
    const { name, price, category } = req.body;
    const errors = [];

    // Validasi nama
    if (!name || typeof name !== "string" || name.trim().length < 3) {
      errors.push("Nama produk harus berupa string dan minimal 3 karakter.");
    }
    next();
  };

  module.exports = productValidation;
  ```

#### 4. Parameterization / Generics

- Teknik parameterization atau generics diterapkan untuk membuat fungsi dan logika yang lebih fleksibel dan dapat digunakan kembali, sehingga dapat menangani berbagai tipe data atau parameter tanpa perlu menulis ulang logika yang sama. 

- Fungsi pagination dan filtering yang digunakan untuk produk dan pengguna dibuat generik, sehingga dapat digunakan untuk entitas lain dengan sedikit atau tanpa modifikasi.

- Contoh implementasi fungsi pagination generik:

  ```js
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const ProductService = {
    getAllWithPagination: async ({ page = 1, limit = 8, category } = {}) => {
      const skip = (page - 1) * limit;
      const filter = category ? { category } : {};

      const [products, totalItems] = await Promise.all([
        prisma.product.findMany({
          where: filter,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            price: true,
            category: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.product.count({ where: filter }),
      ]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        products,
        totalItems,
        totalPages,
      };
    },
  };
  module.exports = ProductService;
  ```

## 🔗 Dokumentasi API Endpoint

<h5>📦 Products API</h5>

| Method | URL API              | Description                                           | Body / Params                                                            | By    |
| ------ | -------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ | ----- |
| GET    | /api/v1/products     | Mengambil daftar semua produk                         | -                                                                        | Danu |
| GET    | /api/v1/products     | Mengambil daftar semua produk dengan pagination       | Query Params: `?page={pageNumber}&limit={pageSize}`                      | Irpan |
| GET    | /api/v1/products/:id | Ambil produk berdasarkan ID                           | Path Param: `:id`                                                        | Firman |
| GET    | /api/v1/products/    | Mengambil daftar produk berdasarkan kategori tertentu | Query Params: `?category={categoryName}`                                 | Frido |
| POST   | /api/v1/products     | Tambah produk baru                                    | Body (form-data): `{ name, price, category, image }`                     | Firman |
| PUT    | /api/v1/products/:id | Ubah data produk berdasarkan ID                       | Path Param: `:id` + Body (form-data): `{ name, price, category, image }` | Irpan |
| DELETE | /api/v1/products/:id | Hapus produk berdasarkan ID                           | Path Param: `:id`                                                        | James |

<h5>🧑‍💼 Users API</h5>

| Method | URL API           | Description                                   | Body / Params                                                     | By    |
| ------ | ----------------- | --------------------------------------------- | ----------------------------------------------------------------- | ----- |
| GET    | /api/v1/users     | Mengambil daftar semua user                   | -                                                                 | James |
| GET    | /api/v1/users     | Mengambil daftar semua user dengan pagination | Query Params: `?page={pageNumber}&limit={pageSize}`               | Irpan |
| GET    | /api/v1/users/:id | Ambil user berdasarkan ID                     | Path Param: `:id`                                                 | Firman |
| POST   | /api/v1/users     | Tambah user baru                              | Body (form-data): `{ name, email, password }`                     | Irpan |
| PUT    | /api/v1/users/:id | Ubah data user berdasarkan ID                 | Path Param: `:id` + Body (form-data): `{ name, email, password }` | Danu |
| DELETE | /api/v1/users/:id | Hapus user berdasarkan ID                     | Path Param: `:id`                                                 | Firman |

## 🌐 Dokumentasi View Routes

<h5>📦 Products API</h5>

| Method | URL API                 | Description                                         | By    |
| ------ | ----------------------- | --------------------------------------------------- | ----- |
| GET    | /view/products          | Tampilkan daftar user (dengan pagination dan limit) | Irpan |
| GET    | /view/products/create   | Form tambah produk                                  | Irpan |
| GET    | /view/products/:id/edit | Form edit produk berdasarkan ID                     | Irpan |

<h5>🧑‍💼 Users API</h5>

| Method | URL API     | Description                                         | By    |
| ------ | ----------- | --------------------------------------------------- | ----- |
| GET    | /view/users | Tampilkan daftar user (dengan pagination dan limit) | Frido |
