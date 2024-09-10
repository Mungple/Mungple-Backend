package com.e106.mungplace.web.marker.service;

import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.assertj.core.api.ThrowableAssert;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.marker.repository.MarkerRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.marker.dto.MarkerCreateRequest;

@ExtendWith(MockitoExtension.class)
public class MarkerServiceTest {

	@Mock
	private MarkerRepository markerRepository;

	@Mock
	private ExplorationRepository explorationRepository;

	@Mock
	private UserHelper userHelper;

	@InjectMocks
	private MarkerService markerService;

	@DisplayName("마커 생성시 없는 여행일시 예외 발생")
	@Test
	public void testCreateMarkerProcess_WhenExplorationNotFound_ThrowsException() {
		// given
		MarkerCreateRequest request = MarkerCreateRequest.builder()
			.title("markerTitle")
			.content("markerContent")
			.lat(new BigDecimal("36.9369"))
			.lon(new BigDecimal("22.2222"))
			.explorationId(1L)
			.build();

		// when
		when(explorationRepository.findById(1L)).thenReturn(Optional.empty());
		ThrowableAssert.ThrowingCallable expectThrow = () -> markerService.createMarkerProcess(request);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationException.class);
	}

	@DisplayName("마커 생성시 마커 저장(산책 할때)")
	@Test
	public void testCreateMarkerProcess_WhenExploring_ThenSaveExploration() {
		// given
		Exploration exploration = new Exploration();
		MarkerCreateRequest request = MarkerCreateRequest.builder()
			.title("markerTitle")
			.content("markerContent")
			.lat(new BigDecimal("36.9369"))
			.lon(new BigDecimal("22.2222"))
			.explorationId(1L)
			.build();

		// when
		when(explorationRepository.findById(1L)).thenReturn(Optional.of(exploration));
		markerService.createMarkerProcess(request);

		// then
		verify(explorationRepository).findById(1L);
		verify(markerRepository).save(any(Marker.class));
	}

	@DisplayName("마커 생성시 마커 저장(산책 안할때)")
	@Test
	public void testCreateMarkerProcess_WhenNotExploring_ThenSaveExploration() {
		// given
		Exploration exploration = new Exploration();
		MarkerCreateRequest request = MarkerCreateRequest.builder()
			.title("markerTitle")
			.content("markerContent")
			.lat(new BigDecimal("36.9369"))
			.lon(new BigDecimal("22.2222"))
			.build();

		// when
		markerService.createMarkerProcess(request);

		// then
		verify(explorationRepository, never()).findById(any());
		verify(markerRepository).save(any(Marker.class));
	}

	@DisplayName("마커 삭제 시 사용자가 소유하지 않은 마커에 대해 예외 발생")
	@Test
	public void testDeleteMarkerProcess_WhenUserDoesNotOwnMarker_ThrowsException() {
		// given
		Long userId = 1L;
		Long markerId = 1L;
		User markerOwner = User.builder().build();

		Marker marker = Marker.builder()
			.title("testMarker")
			.content("testContent")
			.user(markerOwner)
			.build();

		// when
		when(userHelper.getCurrentUserId()).thenReturn(userId);
		when(markerRepository.findById(markerId)).thenReturn(Optional.of(marker));

		// then
		Assertions.assertThatThrownBy(() -> markerService.deleteMarkerProcess(markerId))
			.isInstanceOf(ApplicationException.class);
		verify(markerRepository, never()).delete(any(Marker.class));
	}

	@DisplayName("마커 삭제시 마커가 존재하지 않을 때 예외 발생")
	@Test
	public void testDeleteMarkerProcess_WhenMarkerNotFound_ThrowsException() {
		// given
		Long markerId = 1L;

		// when
		when(markerRepository.findById(markerId)).thenReturn(Optional.empty());
		when(userHelper.getCurrentUserId()).thenReturn(1L);
		ThrowableAssert.ThrowingCallable expectThrow = () -> markerService.deleteMarkerProcess(markerId);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationException.class);
		verify(markerRepository, never()).delete(any(Marker.class));
	}
}


