"""Tokenizador BPE — implementación desde cero.

Inspirado en Karpathy's minbpe, escrito a mano para entender cada decisión.

El algoritmo:
1. Texto → bytes UTF-8 → lista de IDs (cada byte = un token).
2. Repetir N veces:
   a. Encontrar el par adyacente más frecuente.
   b. Mergear ese par → nuevo ID (256, 257, ...).
3. El diccionario `merges` es lo que después usa `encode()` para tokenizar texto nuevo.

El `vocab` mapea cada ID a sus bytes — necesario para `decode()`.
"""

from collections import Counter


class BasicTokenizer:
    """Implementación desde cero de Byte Pair Encoding.

    Aprende merges de un corpus, después encodea/decodea texto.
    """

    def __init__(self):
        self.merges = {}    # (int, int) → int: pair → nuevo_token_id
        self.vocab = {}     # int → bytes: token_id → sus bytes

    def train(self, text, vocab_size, verbose=False):
        """Aprende merges del texto hasta alcanzar vocab_size tokens."""
        # Step 1: texto → bytes → IDs (cada byte empieza siendo su propio token)
        text_bytes = text.encode("utf-8")
        ids = list(text_bytes)

        # Step 2: aprender N merges (uno por cada token nuevo más allá de 256)
        num_merges = vocab_size - 256
        for i in range(num_merges):
            counts = self._get_pair_counts(ids)
            if not counts:
                # No quedan pares — el texto tiene menos de 2 tokens únicos
                break

            # El par con la frecuencia más alta
            pair = max(counts, key=counts.get)

            # Le asignamos un ID nuevo, empezando en 256
            new_id = 256 + i

            # Mergear en todos lados y guardar el merge
            ids = self._merge(ids, pair, new_id)
            self.merges[pair] = new_id

            if verbose:
                pair_chars = ''.join(chr(b) if 32 <= b < 127 else '?' for b in pair)
                print(f"merge {i+1}/{num_merges}: {pair} ('{pair_chars}') → {new_id}")

        # Step 3: construir el vocabulario por composición
        # vocab[idx] = vocab[p0] + vocab[p1] — los merges se componen
        self.vocab = {i: bytes([i]) for i in range(256)}
        for (p0, p1), idx in self.merges.items():
            self.vocab[idx] = self.vocab[p0] + self.vocab[p1]

    def encode(self, text):
        """Convierte texto a una lista de token IDs usando los merges aprendidos."""
        text_bytes = text.encode("utf-8")
        ids = list(text_bytes)

        # Aplicar merges hasta que ninguno aplique
        while len(ids) >= 2:
            counts = self._get_pair_counts(ids)
            # Clave: aplicamos el merge con el ID más bajo (= aprendido primero)
            pair = min(counts, key=lambda p: self.merges.get(p, float('inf')))
            if pair not in self.merges:
                break
            idx = self.merges[pair]
            ids = self._merge(ids, pair, idx)

        return ids

    def decode(self, ids):
        """Convierte una lista de token IDs de vuelta a texto."""
        text_bytes = b"".join(self.vocab[i] for i in ids)
        text = text_bytes.decode("utf-8", errors="replace")
        return text

    def _get_pair_counts(self, ids):
        """Cuenta la frecuencia de cada par adyacente.

        Truco: zip(ids, ids[1:]) genera (a,b), (b,c), (c,d) para [a,b,c,d].
        """
        return Counter(zip(ids, ids[1:]))

    def _merge(self, ids, pair, new_id):
        """Reemplaza todas las ocurrencias del par por new_id.

        Truco del loop: cuando mergeamos, saltamos 2 (consumimos dos elementos);
        cuando no, saltamos 1.
        """
        new_ids = []
        i = 0
        while i < len(ids):
            if ids[i] == pair[0] and i + 1 < len(ids) and ids[i+1] == pair[1]:
                new_ids.append(new_id)
                i += 2
            else:
                new_ids.append(ids[i])
                i += 1
        return new_ids


# Demo: entrenar con texto pequeño y verificar round-trip
if __name__ == "__main__":
    text = "el gato come pescado. el gato come atún. el gato come."

    tokenizer = BasicTokenizer()
    tokenizer.train(text, vocab_size=300, verbose=True)

    print(f"\n✓ Aprendimos {len(tokenizer.merges)} merges")
    print(f"  Vocabulario final: {len(tokenizer.vocab)} tokens")

    # Encode
    test = "el gato come"
    encoded = tokenizer.encode(test)
    print(f"\nEncode '{test}': {encoded}")

    # Decode
    decoded = tokenizer.decode(encoded)
    print(f"Decode: '{decoded}'")

    # Round-trip test
    print(f"\n✓ Round-trip OK: {test == decoded}")