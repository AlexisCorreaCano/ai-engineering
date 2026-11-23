"""Train BasicTokenizer con Don Quijote (español) desde Project Gutenberg.

Muestra los merges que BPE aprende de un corpus real en español.
"""

import sys
from pathlib import Path

# Add src to sys.path so we can import tokenizador
src_path = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(src_path))

import urllib.request
import re

from tokenizador import BasicTokenizer


URL = "http://www.gutenberg.org/cache/epub/2000/pg2000.txt"


def download_text(url):
    """Descarga texto desde una URL."""
    print(f"📥 Descargando {url}...")
    response = urllib.request.urlopen(url, timeout=30)
    text = response.read().decode("utf-8")
    print(f"   {len(text):,} caracteres descargados")
    return text


def strip_gutenberg(text):
    """Saca el header y footer de Project Gutenberg."""
    start_match = re.search(r"\*\*\* START OF.*?\*\*\*", text, re.DOTALL)
    if start_match:
        text = text[start_match.end():]

    end_match = re.search(r"\*\*\* END OF.*?\*\*\*", text)
    if end_match:
        text = text[:end_match.start()]

    return text.strip()


def main():
    # 1. Descargar
    raw_text = download_text(URL)

    # 2. Limpiar header/footer
    text = strip_gutenberg(raw_text)
    print(f"   {len(text):,} caracteres después de limpiar\n")

    # 3. Subset para que el entrenamiento sea rápido
    #    (BPE básico es O(num_merges × n) — con 2M chars y vocab=2000 tarda minutos)
    text = text[:200_000]
    print(f"   Usando los primeros {len(text):,} caracteres para entrenar\n")

    # 3. Entrenar
    print("🔨 Entrenando tokenizer (vocab_size=500)...")
    tokenizer = BasicTokenizer()
    tokenizer.train(text, vocab_size=500, verbose=False)

    print(f"\n✓ Aprendimos {len(tokenizer.merges)} merges")
    print(f"  Vocabulario final: {len(tokenizer.vocab):,} tokens")

    # 4. Mostrar primeros 30 merges en español
    print("\n📚 Primeros 30 merges (lo que el algoritmo aprendió primero):")
    print("   (orden = qué aparece con más frecuencia primero)\n")
    for i, (pair, idx) in enumerate(list(tokenizer.merges.items())[:30]):
        chars = b"".join(tokenizer.vocab[b] for b in pair).decode("utf-8", errors="replace")
        print(f"   {i+1:2d}. '{chars}'")

    # 5. Compresión
    sample_text = text[:1000]
    encoded_sample = tokenizer.encode(sample_text)
    print(f"\n📊 Compresión en los primeros 1000 caracteres:")
    print(f"   Texto original: {len(sample_text)} chars / {len(sample_text.encode('utf-8'))} bytes")
    print(f"   Tokens:         {len(encoded_sample)}")
    print(f"   Ratio:          {len(encoded_sample) / len(sample_text.encode('utf-8')) * 100:.1f}% del original")

    # 6. Ejemplo del Quijote
    sample = "En un lugar de la Mancha, de cuyo nombre no quiero acordarme"
    encoded = tokenizer.encode(sample)
    decoded = tokenizer.decode(encoded)
    print(f"\n🎯 Ejemplo del Quijote:")
    print(f"   Texto:    '{sample}'")
    print(f"   Tokens:   {encoded} ({len(encoded)} tokens)")
    print(f"   Decoded:  '{decoded}'")
    print(f"   Match:    {sample == decoded}")


if __name__ == "__main__":
    main()