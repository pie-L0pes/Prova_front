const form = document.getElementById("formTarefa");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tarefa = {
        nome: document.getElementById("nome").value,
        imagem: document.getElementById("imagem")?.value || "",
        dataInicio: document.getElementById("dataInicio").value ? new Date(document.getElementById("dataInicio").value).toISOString() : null,
        dataFim: document.getElementById("dataFim").value ? new Date(document.getElementById("dataFim").value).toISOString() : null,
        descricao: document.getElementById("descricao").value
    };

    try {
        await fetch("http://localhost:3000/tarefas/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tarefa)
        });

        alert("Tarefa salva");
        form.reset();

    } catch (err) {
        console.log(err);
        alert("Erro ao salvar");
    }
});