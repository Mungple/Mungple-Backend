package com.e106.mungplace.elasticsearch;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.awt.print.Book;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.data.elasticsearch.core.query.IndexQueryBuilder;
import org.springframework.test.context.ActiveProfiles;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@ActiveProfiles("intg")
@SpringBootTest
class ElasticsearchIntgTest {

	@Autowired
	ElasticsearchOperations elasticsearchOperations;

	@BeforeEach
	void setUp() {
		IndexOperations indexOperations = elasticsearchOperations.indexOps(Book.class);
		if (indexOperations.exists()) {
			indexOperations.delete();
		}
		indexOperations.create();
		indexOperations.putMapping(indexOperations.createMapping());
	}

	@Test
	public void testSaveAndFind() {
		// given
		Book book = new Book("1", "Spring Elasticsearch", "John Doe");
		IndexQuery indexQuery = new IndexQueryBuilder()
			.withId(book.getId())
			.withObject(book)
			.build();
		elasticsearchOperations.index(indexQuery, elasticsearchOperations.indexOps(Book.class).getIndexCoordinates());

		// when
		Criteria criteria = Criteria.where("title").is("Spring Elasticsearch");
		CriteriaQuery query = new CriteriaQuery(criteria);
		Book searched = elasticsearchOperations.get(book.id, Book.class);

		// then
		assertThat(searched).isNotNull();
		assertThat(searched.getTitle()).isEqualTo("Spring Elasticsearch");
		assertThat(searched.getAuthor()).isEqualTo("John Doe");
	}

	@AllArgsConstructor
	@NoArgsConstructor
	@Getter
	@Setter
	@Document(indexName = "book")
	static class Book {
		@Id
		private String id;
		private String title;
		private String author;
	}
}