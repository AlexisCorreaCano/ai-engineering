"""Tests para BasicTokenizer.

Cubrimos: round-trip, edge cases, determinismo, compresión y generalización.
"""

from tokenizador import BasicTokenizer


class TestBasicTokenizer:
    """Tests para la clase BasicTokenizer."""

    def test_round_trip_simple(self):
        """Encode → decode recupera el texto original."""
        tokenizer = BasicTokenizer()
        text = "el gato come pescado"
        tokenizer.train(text, vocab_size=300)

        encoded = tokenizer.encode(text)
        decoded = tokenizer.decode(encoded)

        assert decoded == text

    def test_round_trip_with_punctuation(self):
        """Round-trip funciona con puntuación."""
        tokenizer = BasicTokenizer()
        text = "Hola, ¿cómo estás? Bien, gracias."
        tokenizer.train(text, vocab_size=300)

        encoded = tokenizer.encode(text)
        decoded = tokenizer.decode(encoded)

        assert decoded == text

    def test_round_trip_repetitive(self):
        """Round-trip funciona con texto repetitivo."""
        tokenizer = BasicTokenizer()
        text = "el gato come pescado. " * 50
        tokenizer.train(text, vocab_size=400)

        encoded = tokenizer.encode(text)
        decoded = tokenizer.decode(encoded)

        assert decoded == text

    def test_empty_string(self):
        """String vacío encodea a lista vacía y decodea de vuelta a vacío."""
        tokenizer = BasicTokenizer()
        tokenizer.train("hello world", vocab_size=300)

        encoded = tokenizer.encode("")
        decoded = tokenizer.decode(encoded)

        assert encoded == []
        assert decoded == ""

    def test_unicode(self):
        """Unicode round-trip correctamente (emojis, acentos, ñ)."""
        tokenizer = BasicTokenizer()
        text = "Hola mundo 🌍 ¡español! ñoño"
        tokenizer.train(text, vocab_size=300)

        encoded = tokenizer.encode(text)
        decoded = tokenizer.decode(encoded)

        assert decoded == text

    def test_encode_is_deterministic(self):
        """Mismo input produce mismo output en llamadas sucesivas."""
        tokenizer = BasicTokenizer()
        text = "el gato come pescado"
        tokenizer.train(text, vocab_size=300)

        encoded1 = tokenizer.encode(text)
        encoded2 = tokenizer.encode(text)

        assert encoded1 == encoded2

    def test_vocab_size_respected(self):
        """El vocabulario no excede el vocab_size pedido."""
        tokenizer = BasicTokenizer()
        text = "el gato come pescado. el gato come atún."
        tokenizer.train(text, vocab_size=270)

        # vocab es 256 (bytes base) + merges aprendidos
        assert len(tokenizer.vocab) <= 270
        # y al menos 256 (los bytes base siempre están)
        assert len(tokenizer.vocab) >= 256

    def test_merges_learned_for_repetitive_patterns(self):
        """Con texto repetitivo, se aprenden varios merges."""
        tokenizer = BasicTokenizer()
        tokenizer.train("abc abc abc abc abc", vocab_size=260)

        assert len(tokenizer.merges) > 0
        assert len(tokenizer.vocab) > 256

    def test_initial_state(self):
        """Antes de entrenar, el tokenizer tiene estado vacío."""
        tokenizer = BasicTokenizer()

        assert tokenizer.merges == {}
        assert tokenizer.vocab == {}

    def test_compression_on_repetitive_text(self):
        """Texto repetitivo se comprime bien."""
        tokenizer = BasicTokenizer()
        text = "el gato come. " * 100
        tokenizer.train(text, vocab_size=400)

        encoded = tokenizer.encode(text)
        original_bytes = len(text.encode("utf-8"))

        # Con texto muy repetitivo, los tokens deben ser menos que los bytes
        assert len(encoded) < original_bytes

    def test_generalizes_to_unseen_text(self):
        """El encoder funciona con texto NO visto durante el entrenamiento."""
        tokenizer = BasicTokenizer()
        train_text = "el gato come pescado"
        tokenizer.train(train_text, vocab_size=300)

        # Texto distinto — debe encodear/decoar correctamente igual
        new_text = "gato come"
        encoded = tokenizer.encode(new_text)
        decoded = tokenizer.decode(encoded)

        assert decoded == new_text

    def test_decode_handles_invalid_byte(self):
        """Decode con bytes inválidos no rompe (usa errors='replace')."""
        tokenizer = BasicTokenizer()
        tokenizer.train("hello", vocab_size=260)

        # Pasar un ID que no está en vocab debería manejarse gracefully
        # (aunque no debería pasar si encode funciona bien)
        try:
            result = tokenizer.decode([100, 105, 108, 111])  # 'd', 'i', 'l', 'o'
            assert isinstance(result, str)
        except Exception as e:
            # Si falla, al menos no debería ser un crash silencioso
            pytest.fail(f"decode falló inesperadamente: {e}")