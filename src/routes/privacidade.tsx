import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title: "Privacidade | Kit Mapas de Enfermagem" },
    { name: "description", content: "Informações sobre cookies, medição de anúncios e suas escolhas de privacidade." },
    { property: "og:title", content: "Privacidade | Kit Mapas de Enfermagem" },
    { property: "og:description", content: "Saiba como gerenciar cookies e o compartilhamento de dados com a Meta." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Privacy,
});
function Privacy() {
  return <main className="min-h-screen bg-background px-5 py-16 text-foreground"><article className="mx-auto max-w-3xl space-y-6">
    <Link to="/" className="text-primary underline">Voltar à coleção</Link>
    <h1 className="text-3xl font-bold text-deep">Política de privacidade</h1>
    <p>Esta página apresenta a coleção Kit Mapas de Enfermagem. A compra ocorre na Cakto, que aplica suas próprias políticas ao checkout e ao pagamento.</p>
    <h2 className="text-xl font-bold">Cookies e publicidade</h2>
    <p>Usamos o Pixel da Meta Platforms para medir visitas (PageView) e cliques nos botões de compra (ClicouComprar) e apoiar a otimização de anúncios no Facebook e Instagram. Esses cliques não comprovam uma compra. Não enviamos dados de pacientes, condições de saúde, e-mails ou cadastros por esta instalação.</p>
    <p>Quando permitido, a Meta recebe a URL visitada, informações do navegador e dispositivo, endereço IP e identificadores de cookies. Esses dados podem ser associados pela Meta à atividade em seus serviços, conforme sua <a className="underline" href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Política de privacidade</a>.</p>
    <p>Nas regiões que exigem consentimento, incluindo o Brasil por precaução, ou quando não conseguimos confirmar a localização, o Pixel fica bloqueado até sua aceitação. Em outras regiões, a medição pode estar habilitada, respeitando recusas e o sinal Global Privacy Control.</p>
    <h2 className="text-xl font-bold">Suas escolhas</h2>
    <p>Você pode recusar com a mesma facilidade que aceitar e retirar a autorização a qualquer momento em Configurações de cookies. A recusa interrompe novos eventos, mas não desfaz dados enviados anteriormente. Você também pode apagar cookies nas configurações do navegador.</p>
    <p>Registramos neste navegador um identificador aleatório, região, escolha, data, versão e texto do aviso apresentado. Preservamos o registro de aceitação ao registrar uma retirada posterior. Apagar os dados do navegador remove esses registros locais. Os parâmetros de origem da visita são guardados na sessão e repassados ao checkout da Cakto para identificar a origem da compra.</p>
    <Button variant="outline" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}>Configurações de cookies</Button>
    <p>Para questões sobre esta página, entre em contato pelo <a className="underline" href="https://instagram.com/kitenfermagemoficial">@kitenfermagemoficial</a>.</p>
  </article></main>;
}