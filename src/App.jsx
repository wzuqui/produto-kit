import { useMemo, useState } from 'react'

const categories = [
  'Placa-mãe',
  'Processador',
  'Memória RAM',
  'Armazenamento',
  'Placa de vídeo',
  'Fonte',
  'Gabinete',
  'Periféricos',
]

const formatCurrency = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const buildId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10)

const initialProducts = [
  {
    id: buildId(),
    name: 'Placa-mãe B550M',
    category: 'Placa-mãe',
    price: 829.9,
    stock: 8,
    description: 'Compatível com Ryzen, possui 4 slots de RAM e M.2 NVMe.',
  },
  {
    id: buildId(),
    name: 'Memória DDR4 16GB 3200MHz',
    category: 'Memória RAM',
    price: 269.9,
    stock: 24,
    description: 'Módulo único com dissipador low profile.',
  },
  {
    id: buildId(),
    name: 'SSD NVMe 1TB Gen4',
    category: 'Armazenamento',
    price: 489.0,
    stock: 15,
    description: 'Leituras de até 7400MB/s para projetos exigentes.',
  },
]

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [kits, setKits] = useState([])
  const [productForm, setProductForm] = useState({
    name: '',
    category: categories[0],
    price: '',
    stock: '',
    description: '',
  })
  const [kitForm, setKitForm] = useState({ name: '', margin: 20, notes: '' })
  const [kitItems, setKitItems] = useState([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [quantity, setQuantity] = useState(1)

  const kitBaseCost = useMemo(
    () =>
      kitItems.reduce((total, item) => {
        const product = products.find((productItem) => productItem.id === item.productId)
        return total + (product?.price ?? 0) * item.quantity
      }, 0),
    [kitItems, products],
  )

  const kitSalePrice = useMemo(() => {
    const marginValue = Number(kitForm.margin) || 0
    return kitBaseCost * (1 + marginValue / 100)
  }, [kitBaseCost, kitForm.margin])

  const handleProductSubmit = (event) => {
    event.preventDefault()
    if (!productForm.name.trim()) return

    const newProduct = {
      id: buildId(),
      name: productForm.name.trim(),
      category: productForm.category,
      price: Number(productForm.price) || 0,
      stock: Number(productForm.stock) || 0,
      description: productForm.description.trim(),
    }

    setProducts((current) => [...current, newProduct])
    setProductForm({ name: '', category: categories[0], price: '', stock: '', description: '' })
  }

  const handleAddKitItem = () => {
    if (!selectedProductId) return
    const parsedQuantity = Math.max(1, Number(quantity) || 1)

    setKitItems((current) => {
      const existing = current.find((item) => item.productId === selectedProductId)
      if (existing) {
        return current.map((item) =>
          item.productId === selectedProductId
            ? { ...item, quantity: item.quantity + parsedQuantity }
            : item,
        )
      }

      return [...current, { productId: selectedProductId, quantity: parsedQuantity }]
    })

    setSelectedProductId('')
    setQuantity(1)
  }

  const handleRemoveKitItem = (productId) => {
    setKitItems((current) => current.filter((item) => item.productId !== productId))
  }

  const handleKitSubmit = (event) => {
    event.preventDefault()
    if (!kitForm.name.trim() || !kitItems.length) return

    const newKit = {
      id: buildId(),
      name: kitForm.name.trim(),
      margin: Number(kitForm.margin) || 0,
      notes: kitForm.notes.trim(),
      items: kitItems,
      baseCost: kitBaseCost,
      salePrice: kitSalePrice,
    }

    setKits((current) => [...current, newKit])
    setKitForm({ name: '', margin: 20, notes: '' })
    setKitItems([])
  }

  const getProductById = (productId) => products.find((product) => product.id === productId)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Oficina de montagem
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Cadastro de produtos e kits</h1>
            <p className="text-sm text-slate-600">
              Registre componentes individuais e monte kits comerciais com preço sugerido.
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
            Tailwind + React
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Produtos
                </p>
                <h2 className="text-lg font-semibold text-slate-900">Cadastro rápido</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {products.length} itens
              </span>
            </div>
            <form className="space-y-4" onSubmit={handleProductSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="font-medium">Nome</span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ex: Placa-mãe B760M"
                    value={productForm.name}
                    onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                    required
                  />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                  <span className="font-medium">Categoria</span>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={productForm.category}
                    onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="font-medium">Preço de compra</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="0,00"
                    value={productForm.price}
                    onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                    required
                  />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                  <span className="font-medium">Estoque</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="Qtd disponível"
                    value={productForm.stock}
                    onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Descrição rápida</span>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="Compatibilidade, clocks, conectores, etc."
                  value={productForm.description}
                  onChange={(event) =>
                    setProductForm({ ...productForm, description: event.target.value })
                  }
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  Adicionar produto
                </button>
                <p className="text-xs text-slate-500">
                  Os produtos cadastrados ficam disponíveis para compor kits comerciais.
                </p>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Kit comercial
                </p>
                <h2 className="text-lg font-semibold text-slate-900">Montagem e margem</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {kitItems.length ? `${kitItems.length} componentes` : 'Selecione itens'}
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleKitSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-700">
                  <span className="font-medium">Nome do kit</span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ex: Kit gamer Ryzen"
                    value={kitForm.name}
                    onChange={(event) => setKitForm({ ...kitForm, name: event.target.value })}
                    required
                  />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                  <span className="font-medium">Margem (%)</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    value={kitForm.margin}
                    onChange={(event) => setKitForm({ ...kitForm, margin: event.target.value })}
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm text-slate-700">
                <span className="font-medium">Observações</span>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="Diferenças, brindes, personalização..."
                  value={kitForm.notes}
                  onChange={(event) => setKitForm({ ...kitForm, notes: event.target.value })}
                />
              </label>

              <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <div className="mb-3 flex flex-wrap items-end gap-3">
                  <label className="flex-1 space-y-1 text-sm text-slate-700">
                    <span className="font-medium">Adicionar componente</span>
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      value={selectedProductId}
                      onChange={(event) => setSelectedProductId(event.target.value)}
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} · {product.category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="w-32 space-y-1 text-sm text-slate-700">
                    <span className="font-medium">Qtd.</span>
                    <input
                      type="number"
                      min="1"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddKitItem}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    Incluir
                  </button>
                </div>

                <div className="space-y-3">
                  {kitItems.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Nenhum componente no kit. Use a lista acima para adicionar itens.
                    </p>
                  )}

                  {kitItems.map((item) => {
                    const product = getProductById(item.productId)
                    if (!product) return null

                    return (
                      <div
                        key={item.productId}
                        className="flex items-start justify-between gap-3 rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">
                            {product.category} · {formatCurrency(product.price)} · {item.quantity}x
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveKitItem(item.productId)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          Remover
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Valores sugeridos
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-emerald-900">
                    <span className="font-semibold">Custo: {formatCurrency(kitBaseCost)}</span>
                    <span className="font-semibold">
                      Preço final: {kitSalePrice ? formatCurrency(kitSalePrice) : '—'}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  disabled={!kitForm.name.trim() || kitItems.length === 0}
                >
                  Salvar kit
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Inventário
                </p>
                <h2 className="text-lg font-semibold text-slate-900">Produtos cadastrados</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {products.length} registros
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Preço</th>
                    <th className="px-4 py-3">Estoque</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-emerald-50/40">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-slate-500">{product.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Dica rápida
              </p>
              <h3 className="mt-2 text-xl font-bold">Monte kits com segurança</h3>
              <p className="mt-2 text-sm text-emerald-50">
                Use margens diferentes para segmentos gamer, escritório ou criativo. O custo total do kit é
                recalculado sempre que você adiciona ou remove peças.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold">
                <div className="rounded-lg bg-white/10 px-3 py-2">CPU / GPU</div>
                <div className="rounded-lg bg-white/10 px-3 py-2">Armazenamento</div>
                <div className="rounded-lg bg-white/10 px-3 py-2">Acessórios</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Kits salvos</p>
                  <h2 className="text-lg font-semibold text-slate-900">Portfólio</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {kits.length} kits
                </span>
              </div>

              {kits.length === 0 && (
                <p className="text-sm text-slate-500">Nenhum kit cadastrado ainda.</p>
              )}

              <div className="space-y-3">
                {kits.map((kit) => (
                  <div
                    key={kit.id}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-100"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{kit.name}</h3>
                        <p className="text-xs text-slate-500">Margem aplicada: {kit.margin}%</p>
                        {kit.notes && <p className="text-sm text-slate-600">{kit.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Preço sugerido</p>
                        <p className="text-lg font-bold text-emerald-700">{formatCurrency(kit.salePrice)}</p>
                        <p className="text-xs text-slate-500">Custo: {formatCurrency(kit.baseCost)}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {kit.items.map((item) => {
                        const product = getProductById(item.productId)
                        if (!product) return null
                        return (
                          <span
                            key={item.productId}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                          >
                            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                            {product.category} · {item.quantity}x {product.name}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
