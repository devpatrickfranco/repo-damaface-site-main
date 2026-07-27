import assert from "node:assert/strict"
import test from "node:test"

import {
  getPaginaRaiz,
  getProcedimentoDaUnidade,
  getUnidade,
  getUnidadesIndexaveis,
} from "@/services/unidades"

// Estes testes fazem chamadas reais à API (NEXT_PUBLIC_API_BACKEND_URL) —
// rode contra um backend com o seed de apps/unidades/management/commands/seed_unidades_procedimentos.py aplicado.

test("resolve uma unidade indexável pela rota raiz", async () => {
  const pagina = await getPaginaRaiz("vinhedo")

  assert.equal(pagina?.tipo, "unidade")
  assert.equal(pagina?.unidade.cidade, "Vinhedo")
})

test("resolve o procedimento nacional pela rota raiz", async () => {
  const pagina = await getPaginaRaiz("toxina-botulinica")

  assert.equal(pagina?.tipo, "procedimento")
  assert.equal(pagina?.procedimento.nome, "Toxina Botulínica")
})

test("não expõe unidades em implantação para SEO", async () => {
  assert.equal(await getUnidade("cajamar"), null)
  const unidades = await getUnidadesIndexaveis()
  assert.ok(unidades.every((unidade) => unidade.indexavel))
})

test("só resolve um procedimento oferecido pela unidade", async () => {
  const procedimento = await getProcedimentoDaUnidade("vinhedo", "toxina-botulinica")
  assert.equal(procedimento?.nome, "Toxina Botulínica")
  assert.equal(await getProcedimentoDaUnidade("vinhedo", "procedimento-inexistente"), null)
})
